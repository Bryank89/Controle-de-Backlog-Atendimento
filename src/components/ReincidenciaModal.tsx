import React, { useState, useMemo } from 'react';
import {
  Search,
  UserCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  Layers,
  Phone,
  FileText,
} from 'lucide-react';
import { ProtocoloVLI, SubtemaConfig } from '../types';
import { SUBTEMAS_VLI } from '../data/mockData';
import { formatarDataSimples } from '../utils/slaEngine';

interface ReincidenciaModalProps {
  protocolos: ProtocoloVLI[];
  onOpenProtocolo: (protocolo: ProtocoloVLI) => void;
}

export const ReincidenciaModal: React.FC<ReincidenciaModalProps> = ({
  protocolos,
  onOpenProtocolo,
}) => {
  const [activeTab, setActiveTab] = useState<'contato' | 'bairro_subtema'>('contato');

  // Fields for Tab 1: Contato / CPF
  const [searchDocPhone, setSearchDocPhone] = useState('');

  // Fields for Tab 2: Bairro + Subtema (últimos 5 dias)
  const [searchBairro, setSearchBairro] = useState('');
  const [selectedSubtemaId, setSelectedSubtemaId] = useState('');

  // Results for Search 1: CPF / Phone
  const resultsByContact = useMemo(() => {
    if (!searchDocPhone.trim()) return [];
    const cleanSearch = searchDocPhone.replace(/\D/g, '').toLowerCase();
    const query = searchDocPhone.toLowerCase();

    return protocolos.filter((p) => {
      const cpfClean = p.manifestante.cpf.replace(/\D/g, '');
      const celClean = p.manifestante.celular.replace(/\D/g, '');
      const telClean = p.manifestante.telefone.replace(/\D/g, '');

      if (cleanSearch.length >= 4) {
        if (cpfClean.includes(cleanSearch) || celClean.includes(cleanSearch) || telClean.includes(cleanSearch)) {
          return true;
        }
      }
      return (
        p.manifestante.cpf.toLowerCase().includes(query) ||
        p.manifestante.celular.toLowerCase().includes(query) ||
        p.manifestante.telefone.toLowerCase().includes(query) ||
        p.manifestante.nome.toLowerCase().includes(query)
      );
    });
  }, [protocolos, searchDocPhone]);

  // Results for Search 2: Bairro + Subtema nos últimos 5 dias
  const resultsByBairroSubtema = useMemo(() => {
    if (!searchBairro.trim() && !selectedSubtemaId) return [];
    const queryBairro = searchBairro.trim().toLowerCase();

    return protocolos.filter((p) => {
      // Must be within 5 business days or 7 calendar days
      const isRecent = p.diasUteisCorridos <= 5;
      const matchBairro = queryBairro ? p.localizacao.bairro.toLowerCase().includes(queryBairro) : true;
      const matchSubtema = selectedSubtemaId ? p.classificacao.subtemaId === selectedSubtemaId : true;

      return isRecent && matchBairro && matchSubtema;
    });
  }, [protocolos, searchBairro, selectedSubtemaId]);

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-500" />
          <span>Localizador de Reincidência & Alertas Comunitários</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Conforme diretriz da VLI: Celular, Telefone e CPF localizam reincidência direta do manifestante.
          A busca cruzada por <strong>Bairro + Subtema nos últimos 5 dias</strong> identifica ocorrências em série na mesma localidade (como apitos noturnos, bloqueios de passagem ou fumaça).
        </p>

        {/* Tab Selector */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-800 pt-2">
          <button
            onClick={() => setActiveTab('contato')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'contato'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Busca por CPF / Celular / Telefone</span>
          </button>

          <button
            onClick={() => setActiveTab('bairro_subtema')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bairro_subtema'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Busca Cruzada: Mesmo Bairro e Subtema (Últimos 5 dias)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: CPF / Telefone Search */}
      {activeTab === 'contato' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Digite CPF, Celular, Telefone ou Nome do Manifestante:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchDocPhone}
                  onChange={(e) => setSearchDocPhone(e.target.value)}
                  placeholder="Ex: 128.455.908-11 ou (13) 98124-7744 ou Antônio..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
              {searchDocPhone && (
                <button
                  onClick={() => setSearchDocPhone('')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
              <span>Testar dados da base:</span>
              <button
                onClick={() => setSearchDocPhone('128.455.908-11')}
                className="text-amber-400 hover:underline"
              >
                CPF: 128.455.908-11
              </button>
              <span>·</span>
              <button
                onClick={() => setSearchDocPhone('99312-0044')}
                className="text-amber-400 hover:underline"
              >
                Celular: (31) 99312-0044
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Protocolos Localizados ({resultsByContact.length})
              </span>
              {resultsByContact.length > 0 && (
                <span className="text-amber-400 font-mono text-[11px]">
                  {resultsByContact.length > 1 ? 'Reincidência Confirmada' : '1 Registro Anterior'}
                </span>
              )}
            </div>

            {searchDocPhone.trim() === '' ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Digite um documento ou telefone para verificar o histórico do manifestante.
              </div>
            ) : resultsByContact.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum protocolo anterior encontrado com estes dados. Este é um <strong>Primeiro Contato</strong>.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {resultsByContact.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {p.numeroProtocolo}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-300">{formatarDataSimples(p.dataCriacao)}</span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-amber-400">{p.classificacao.subtemaNome}</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        <strong>{p.manifestante.nome}</strong> · {p.localizacao.cidadeNome} / {p.localizacao.uf} ({p.localizacao.bairro})
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {p.classificacao.textoDemanda}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {p.encaminhamento.posicionamento}
                      </span>
                      <button
                        onClick={() => onOpenProtocolo(p)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors"
                      >
                        Visualizar Ficha
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Bairro + Subtema Search (last 5 days) */}
      {activeTab === 'bairro_subtema' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bairro da Ocorrência:
              </label>
              <input
                type="text"
                value={searchBairro}
                onChange={(e) => setSearchBairro(e.target.value)}
                placeholder="Ex: Barreiro de Cima, Porto Alemoa, Betel..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subtema da Manifestação:
              </label>
              <select
                value={selectedSubtemaId}
                onChange={(e) => setSelectedSubtemaId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione um subtema...</option>
                {SUBTEMAS_VLI.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Protocolos nos últimos 5 dias no mesmo Bairro / Subtema ({resultsByBairroSubtema.length})
              </span>
            </div>

            {resultsByBairroSubtema.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Informe o Bairro ou selecione o Subtema para pesquisar chamados recentes na mesma região.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {resultsByBairroSubtema.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {p.numeroProtocolo}
                        </span>
                        <span className="text-xs text-amber-400 font-semibold">
                          D+{p.diasUteisCorridos}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-300 font-medium">
                          {p.localizacao.bairro} ({p.localizacao.cidadeNome} / {p.localizacao.uf})
                        </span>
                        {p.localizacao.km && (
                          <span className="text-xs font-mono text-slate-400">
                            · KM {p.localizacao.km}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Subtema: <strong className="text-amber-300">{p.classificacao.subtemaNome}</strong> · Manifestante: {p.manifestante.nome}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {p.classificacao.textoDemanda}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => onOpenProtocolo(p)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors"
                      >
                        Abrir Registro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
