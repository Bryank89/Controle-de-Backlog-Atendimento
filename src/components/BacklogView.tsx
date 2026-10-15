import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  ChevronRight,
  MapPin,
  Train,
  Mail,
  User,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Send,
} from 'lucide-react';
import {
  CorredorVLI,
  PosicionamentoStatus,
  ProtocoloVLI,
  CanalEntrada,
  TipoManifestacao,
} from '../types';
import { formatarDataHora, formatarDataSimples } from '../utils/slaEngine';

interface BacklogViewProps {
  protocolos: ProtocoloVLI[];
  onOpenProtocolo: (protocolo: ProtocoloVLI) => void;
  onOpenNovo: () => void;
  onExportExcel: () => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({
  protocolos,
  onOpenProtocolo,
  onOpenNovo,
  onExportExcel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [slaFilter, setSlaFilter] = useState<'todos' | 'venceHoje' | 'prazoProximo' | 'foraPrazo' | 'noPrazo'>('todos');
  const [posicionamentoFilter, setPosicionamentoFilter] = useState<string>('todos');
  const [corredorFilter, setCorredorFilter] = useState<string>('todos');
  const [canalFilter, setCanalFilter] = useState<string>('todos');
  const [reincidenciaOnly, setReincidenciaOnly] = useState(false);

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = protocolos.length;
    const venceHoje = protocolos.filter((p) => p.statusSla === 'Vence hoje' && p.encaminhamento.posicionamento !== 'Fechado').length;
    const prazoProximo = protocolos.filter((p) => p.statusSla === 'Prazo próximo' && p.encaminhamento.posicionamento !== 'Fechado').length;
    const foraPrazo = protocolos.filter((p) => p.statusSla === 'Fora do prazo' && p.encaminhamento.posicionamento !== 'Fechado').length;
    const pendentes = protocolos.filter((p) => p.encaminhamento.posicionamento === 'Pendente').length;
    const emAnalise = protocolos.filter((p) => p.encaminhamento.posicionamento === 'Em análise').length;
    const fechados = protocolos.filter((p) => p.encaminhamento.posicionamento === 'Fechado').length;

    return { total, venceHoje, prazoProximo, foraPrazo, pendentes, emAnalise, fechados };
  }, [protocolos]);

  // Filtered List
  const filteredProtocolos = useMemo(() => {
    return protocolos.filter((p) => {
      // Search text
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchNumero = p.numeroProtocolo.toLowerCase().includes(query);
        const matchNome = p.manifestante.nome.toLowerCase().includes(query);
        const matchCpf = p.manifestante.cpf.includes(query);
        const matchCidade = p.localizacao.cidadeNome.toLowerCase().includes(query);
        const matchBairro = p.localizacao.bairro.toLowerCase().includes(query);
        const matchTema = p.classificacao.temaNome.toLowerCase().includes(query);
        const matchSubtema = p.classificacao.subtemaNome.toLowerCase().includes(query);
        const matchDemanda = p.classificacao.textoDemanda.toLowerCase().includes(query);
        if (!matchNumero && !matchNome && !matchCpf && !matchCidade && !matchBairro && !matchTema && !matchSubtema && !matchDemanda) {
          return false;
        }
      }

      // SLA Filter
      if (slaFilter === 'venceHoje' && (p.statusSla !== 'Vence hoje' || p.encaminhamento.posicionamento === 'Fechado')) return false;
      if (slaFilter === 'prazoProximo' && (p.statusSla !== 'Prazo próximo' || p.encaminhamento.posicionamento === 'Fechado')) return false;
      if (slaFilter === 'foraPrazo' && (p.statusSla !== 'Fora do prazo' || p.encaminhamento.posicionamento === 'Fechado')) return false;
      if (slaFilter === 'noPrazo' && (p.statusSla !== 'No prazo' || p.encaminhamento.posicionamento === 'Fechado')) return false;

      // Posicionamento
      if (posicionamentoFilter !== 'todos' && p.encaminhamento.posicionamento !== posicionamentoFilter) return false;

      // Corredor
      if (corredorFilter !== 'todos' && p.localizacao.corredor !== corredorFilter) return false;

      // Canal
      if (canalFilter !== 'todos' && p.canal !== canalFilter) return false;

      // Reincidencia
      if (reincidenciaOnly && p.classificacao.reincidencia !== 'Reincidência') return false;

      return true;
    });
  }, [protocolos, searchTerm, slaFilter, posicionamentoFilter, corredorFilter, canalFilter, reincidenciaOnly]);

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs font-medium text-slate-400">Total Backlog</div>
          <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
            {metrics.total}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {metrics.pendentes} pendentes · {metrics.emAnalise} em análise
          </div>
        </div>

        <button
          onClick={() => setSlaFilter(slaFilter === 'venceHoje' ? 'todos' : 'venceHoje')}
          className={`text-left p-3.5 rounded-lg border transition-all ${
            slaFilter === 'venceHoje'
              ? 'bg-orange-950/40 border-orange-500 ring-1 ring-orange-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-orange-500/50'
          }`}
        >
          <div className="text-xs font-medium text-orange-400 flex items-center justify-between">
            <span>Vence Hoje (D+5)</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-orange-300 tabular-nums">
            {metrics.venceHoje}
          </div>
          <div className="mt-1 text-xs text-orange-400/80">Atingiu prazo limite</div>
        </button>

        <button
          onClick={() => setSlaFilter(slaFilter === 'prazoProximo' ? 'todos' : 'prazoProximo')}
          className={`text-left p-3.5 rounded-lg border transition-all ${
            slaFilter === 'prazoProximo'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="text-xs font-medium text-amber-400 flex items-center justify-between">
            <span>Prazo Próximo (D+3)</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {metrics.prazoProximo}
          </div>
          <div className="mt-1 text-xs text-amber-400/80">Cobrança preventiva</div>
        </button>

        <button
          onClick={() => setSlaFilter(slaFilter === 'foraPrazo' ? 'todos' : 'foraPrazo')}
          className={`text-left p-3.5 rounded-lg border transition-all ${
            slaFilter === 'foraPrazo'
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="text-xs font-medium text-rose-400 flex items-center justify-between">
            <span>Fora do Prazo (D+7+)</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-rose-300 tabular-nums">
            {metrics.foraPrazo}
          </div>
          <div className="mt-1 text-xs text-rose-400/80">Cobrança crítica</div>
        </button>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs font-medium text-slate-400">Em Análise Técnica</div>
          <div className="mt-1 text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {metrics.emAnalise}
          </div>
          <div className="mt-1 text-xs text-slate-400">Invasão & Vegetação D+5</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
          <div className="text-xs font-medium text-emerald-400 flex items-center justify-between">
            <span>Finalizados</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.fechados}
          </div>
          <div className="mt-1 text-xs text-emerald-400/80">Casos concluídos</div>
        </div>
      </div>

      {/* Filter and Action Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por protocolo, nome do manifestante, CPF, cidade, bairro ou tema..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
            </input>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportExcel}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
              title="Exportar base completa para Excel / CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Badges and Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          {/* SLA Filter Segmented Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
            <button
              onClick={() => setSlaFilter('todos')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                slaFilter === 'todos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({protocolos.length})
            </button>
            <button
              onClick={() => setSlaFilter('venceHoje')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                slaFilter === 'venceHoje' ? 'bg-orange-500 text-slate-950 font-semibold' : 'text-orange-400 hover:text-orange-300'
              }`}
            >
              Vence Hoje ({metrics.venceHoje})
            </button>
            <button
              onClick={() => setSlaFilter('prazoProximo')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                slaFilter === 'prazoProximo' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Prazo Próximo ({metrics.prazoProximo})
            </button>
            <button
              onClick={() => setSlaFilter('foraPrazo')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                slaFilter === 'foraPrazo' ? 'bg-rose-600 text-white font-semibold' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Fora do Prazo ({metrics.foraPrazo})
            </button>
          </div>

          {/* Posicionamento Selector */}
          <select
            value={posicionamentoFilter}
            onChange={(e) => setPosicionamentoFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md px-2.5 py-1.5 focus:border-amber-500 outline-none"
          >
            <option value="todos">Status: Todos</option>
            <option value="Pendente">Status: Pendente</option>
            <option value="Em análise">Status: Em Análise</option>
            <option value="Fechado">Status: Fechado</option>
          </select>

          {/* Corredor Selector */}
          <select
            value={corredorFilter}
            onChange={(e) => setCorredorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md px-2.5 py-1.5 focus:border-amber-500 outline-none"
          >
            <option value="todos">Corredor: Todos</option>
            <option value="Corredor Centro-Leste">Corredor Centro-Leste</option>
            <option value="Corredor Centro-Sudeste">Corredor Centro-Sudeste</option>
            <option value="Corredor Centro-Norte">Corredor Centro-Norte</option>
            <option value="Corredor Minas-Rio">Corredor Minas-Rio</option>
            <option value="Corredor Indefinido / Fora da Concessão">Fora da Concessão</option>
          </select>

          {/* Canal Selector */}
          <select
            value={canalFilter}
            onChange={(e) => setCanalFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md px-2.5 py-1.5 focus:border-amber-500 outline-none"
          >
            <option value="todos">Canal: Todos</option>
            <option value="Alô VLI 0800">Alô VLI 0800</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Site fale conosco">Site Fale Conosco</option>
            <option value="Atendimento em Libras">Atendimento em Libras</option>
          </select>

          {/* Reincidência Toggle */}
          <button
            onClick={() => setReincidenciaOnly(!reincidenciaOnly)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
              reincidenciaOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Reincidências
          </button>

          {(searchTerm || slaFilter !== 'todos' || posicionamentoFilter !== 'todos' || corredorFilter !== 'todos' || canalFilter !== 'todos' || reincidenciaOnly) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSlaFilter('todos');
                setPosicionamentoFilter('todos');
                setCorredorFilter('todos');
                setCanalFilter('todos');
                setReincidenciaOnly(false);
              }}
              className="text-xs text-amber-400 hover:underline ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Backlog High-Density Data Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Protocolo / Canal</th>
                <th className="py-3 px-4">Data Abertura</th>
                <th className="py-3 px-4">Manifestante & Contato</th>
                <th className="py-3 px-4">Local / Corredor</th>
                <th className="py-3 px-4">Classificação (Tema / Subtema)</th>
                <th className="py-3 px-4 text-center">SLA 5 Dias Úteis</th>
                <th className="py-3 px-4 text-center">Posicionamento</th>
                <th className="py-3 px-4 text-center">Encaminhado</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProtocolos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-medium text-slate-400">Nenhum protocolo encontrado com os filtros selecionados.</p>
                    <p className="text-xs text-slate-500 mt-1">Ajuste os filtros ou crie um novo atendimento.</p>
                  </td>
                </tr>
              ) : (
                filteredProtocolos.map((p) => {
                  const isFechado = p.encaminhamento.posicionamento === 'Fechado';
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onOpenProtocolo(p)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Protocolo */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-semibold text-white tracking-tight">
                          {p.numeroProtocolo}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>{p.canal}</span>
                          {p.classificacao.reincidencia === 'Reincidência' && (
                            <span className="text-amber-400 font-medium font-mono text-[10px] bg-amber-950/60 px-1 rounded border border-amber-800/60">
                              REINCIDENTE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Data Abertura */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums text-slate-200">
                          {formatarDataSimples(p.dataCriacao)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.diasUteisCorridos} dias úteis
                        </div>
                      </td>

                      {/* Manifestante */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="font-medium text-slate-100 truncate" title={p.manifestante.nome}>
                          {p.manifestante.nome}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                          {p.manifestante.celular || p.manifestante.telefone || p.manifestante.cpf || '-'}
                        </div>
                      </td>

                      {/* Localização / Corredor */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="text-slate-100 font-medium truncate">
                          {p.localizacao.cidadeNome} / {p.localizacao.uf}
                        </div>
                        <div className="text-[11px] text-amber-400/90 truncate mt-0.5">
                          {p.localizacao.corredor.replace('Corredor ', '')}
                        </div>
                        {p.localizacao.km && (
                          <div className="text-[10px] font-mono text-slate-400">
                            KM {p.localizacao.km} {p.localizacao.sb ? `· ${p.localizacao.sb}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Classificação */}
                      <td className="py-3 px-4 max-w-[230px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-200 truncate" title={p.classificacao.tipo}>
                            {p.classificacao.tipo}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 truncate" title={p.classificacao.subtemaNome}>
                            {p.classificacao.subtemaNome}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          Tema: {p.classificacao.temaNome}
                        </div>
                      </td>

                      {/* SLA 5 Dias Úteis */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        {isFechado ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Fechado
                          </span>
                        ) : p.statusSla === 'Vence hoje' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-300 bg-orange-950/70 border border-orange-700/80 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-orange-400" />
                            Vence Hoje (D+5)
                          </span>
                        ) : p.statusSla === 'Prazo próximo' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/70 border border-amber-700/80 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-amber-400" />
                            D+{p.diasUteisCorridos} Próximo
                          </span>
                        ) : p.statusSla === 'Fora do prazo' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/70 border border-rose-700/80 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            D+{p.diasUteisCorridos} Atrasado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded">
                            D+{p.diasUteisCorridos} No Prazo
                          </span>
                        )}
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          Venc.: {formatarDataSimples(p.dataVencimento)}
                        </div>
                      </td>

                      {/* Posicionamento */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${
                            p.encaminhamento.posicionamento === 'Fechado'
                              ? 'bg-slate-800 text-slate-300'
                              : p.encaminhamento.posicionamento === 'Em análise'
                              ? 'bg-sky-950/80 text-sky-300 border border-sky-800/60'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          {p.encaminhamento.posicionamento}
                        </span>
                      </td>

                      {/* Encaminhado */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        {p.encaminhamento.encaminhado === 'Sim' ? (
                          <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>Sim {p.encaminhamento.emailEnviado ? '(E-mail OK)' : ''}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Não</span>
                        )}
                        {p.encaminhamento.conhecimento !== 'Não se aplica' && (
                          <div className="text-[10px] text-slate-400">
                            Conhec: {p.encaminhamento.conhecimento}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProtocolo(p);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded transition-colors"
                        >
                          Tratar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
