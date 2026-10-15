import React, { useState } from 'react';
import {
  Database,
  MapPin,
  Tag,
  Users,
  Upload,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  Train,
  Check,
} from 'lucide-react';
import {
  CidadeConfig,
  RespondenteMailing,
  SubtemaConfig,
  TemaConfig,
} from '../types';
import { CIDADES_VLI, TEMAS_VLI, SUBTEMAS_VLI, MAILING_RESPONDENTES } from '../data/mockData';

export const CadastrosModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cidades' | 'temas' | 'mailing'>('cidades');
  const [cidades, setCidades] = useState<CidadeConfig[]>(CIDADES_VLI);
  const [temas] = useState<TemaConfig[]>(TEMAS_VLI);
  const [subtemas] = useState<SubtemaConfig[]>(SUBTEMAS_VLI);
  const [mailing] = useState<RespondenteMailing[]>(MAILING_RESPONDENTES);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSimulateImport = () => {
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              <span>Cadastros & Matriz de Mailing VLI</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Cadastros estruturados que sustentam as regras de negócio: amarração de Corredores a Cidades, IDs numéricos de Temas/Subtemas, e o Mailing que define analistas e respondentes nas fichas e cobranças.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateImport}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
              title="Importar planilha de mailing para atualizar analistas e respondentes"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Importar Planilha Mailing</span>
            </button>
          </div>
        </div>

        {importSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/70 border border-emerald-700/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mailing atualizado com sucesso! Todas as amarrações de Cidade, Tema e Subtema foram recarregadas.</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="mt-4 flex items-center gap-3 border-b border-slate-800 pt-2">
          <button
            onClick={() => setActiveTab('cidades')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'cidades'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Cidades, Corredores & Analistas</span>
          </button>

          <button
            onClick={() => setActiveTab('temas')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'temas'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Temas, Subtemas & Validações KM/SB</span>
          </button>

          <button
            onClick={() => setActiveTab('mailing')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'mailing'
                ? 'border-amber-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Matriz de Respondentes (Mailing)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cidades & Corredores */}
      {activeTab === 'cidades' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-300">
            Cidades Cadastradas e Roteamento de Analistas (VLI)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Cidade / UF</th>
                  <th className="py-2.5 px-4">Corredor Vinculado</th>
                  <th className="py-2.5 px-4">Analistas da Cidade (Até 4)</th>
                  <th className="py-2.5 px-4">Analista de RI (Órgão Público)</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {cidades.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {c.nome} / {c.uf}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-medium whitespace-nowrap">
                      {c.corredor}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="space-y-0.5">
                        {c.analistas.map((an, i) => (
                          <div key={i} className="text-slate-300">
                            · {an}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-sky-300 whitespace-nowrap">
                      {c.analistaRI || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Ativa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Temas e Subtemas */}
      {activeTab === 'temas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-300">
            Temas e Subtemas (Identificação por ID Numérico & Regras de KM/SB)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Subtema ID</th>
                  <th className="py-2.5 px-4">Subtema Nome</th>
                  <th className="py-2.5 px-4">Tema Vinculado</th>
                  <th className="py-2.5 px-4 text-center">Exige KM e SB?</th>
                  <th className="py-2.5 px-4">Regra Específica</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {subtemas.map((s) => {
                  const temaPai = temas.find((t) => t.id === s.temaId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-400">
                        {s.id}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-white">
                        {s.nome}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">
                        {temaPai?.nome} (ID: {s.temaId})
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {s.exigeKmSb ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            OBRIGATÓRIO
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Opcional</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-slate-400">
                        {s.regraEspecialVegetacao
                          ? 'Regra Vegetação Alta: D+5 manifestante e Em análise; D+10..D+53 cobrança'
                          : s.posicionamentoPadrao
                          ? `Sugestão automática: ${s.posicionamentoPadrao}`
                          : 'Fluxo padrão (5 dias úteis)'}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Ativo
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Mailing de Respondentes */}
      {activeTab === 'mailing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-300">
            Matriz de Respondentes (Mailing importado por Cidade, Tema e Subtema)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Cidade de Aplicação</th>
                  <th className="py-2.5 px-4">Tema / Subtema ID</th>
                  <th className="py-2.5 px-4">Nome do Respondente / Equipe</th>
                  <th className="py-2.5 px-4">E-mail VLI</th>
                  <th className="py-2.5 px-4">Área Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {mailing.map((m) => {
                  const cidade = cidades.find((c) => c.id === m.cidadeId);
                  const sub = subtemas.find((s) => s.id === m.subtemaId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {cidade ? (
                          <span className="text-white font-medium">{cidade.nome} / {cidade.uf}</span>
                        ) : (
                          <span className="text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 text-[11px]">
                            Válido p/ todas as cidades
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-300">
                        {sub?.nome || `Subtema ${m.subtemaId}`}
                      </td>
                      <td className="py-2.5 px-4 text-white font-medium">
                        {m.nome}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-xs text-sky-400">
                        {m.email}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 text-xs">
                        {m.area}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
