import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Mail,
  Send,
  Play,
  RotateCcw,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { ProtocoloVLI } from '../types';
import { formatarDataSimples, formatarDataHora } from '../utils/slaEngine';

interface VencimentosCobrancaViewProps {
  protocolos: ProtocoloVLI[];
  onMarcarAvisoManual: (protocoloId: string) => void;
  onExecutarRotinaAutomatica: () => void;
  onOpenProtocolo: (protocolo: ProtocoloVLI) => void;
}

export const VencimentosCobrancaView: React.FC<VencimentosCobrancaViewProps> = ({
  protocolos,
  onMarcarAvisoManual,
  onExecutarRotinaAutomatica,
  onOpenProtocolo,
}) => {
  const [selectedMarco, setSelectedMarco] = useState<'todos' | 'd3' | 'd5' | 'd7_plus' | 'vegetacao'>('todos');
  const [lastBatchExecution, setLastBatchExecution] = useState<string | null>('Hoje às 08:00');

  // Filter only active tickets (not closed)
  const protocolosAtivos = useMemo(() => {
    return protocolos.filter((p) => p.encaminhamento.posicionamento !== 'Fechado');
  }, [protocolos]);

  // Breakdown by SLA Marco
  const marcoD3 = useMemo(() => {
    return protocolosAtivos.filter((p) => p.diasUteisCorridos === 3 || p.diasUteisCorridos === 4);
  }, [protocolosAtivos]);

  const marcoD5 = useMemo(() => {
    return protocolosAtivos.filter((p) => p.diasUteisCorridos === 5);
  }, [protocolosAtivos]);

  const marcoD7Plus = useMemo(() => {
    return protocolosAtivos.filter((p) => p.diasUteisCorridos >= 6);
  }, [protocolosAtivos]);

  const marcoVegetacao = useMemo(() => {
    return protocolosAtivos.filter((p) => p.classificacao.subtemaId === '202');
  }, [protocolosAtivos]);

  // Filtered protocols based on tab
  const displayedProtocolos = useMemo(() => {
    if (selectedMarco === 'd3') return marcoD3;
    if (selectedMarco === 'd5') return marcoD5;
    if (selectedMarco === 'd7_plus') return marcoD7Plus;
    if (selectedMarco === 'vegetacao') return marcoVegetacao;
    return protocolosAtivos;
  }, [selectedMarco, marcoD3, marcoD5, marcoD7Plus, marcoVegetacao, protocolosAtivos]);

  return (
    <div className="space-y-6">
      {/* Header Info & Process Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Painel de Vencimentos & Régua de Cobrança Alô VLI</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Monitoramento dos marcos de prazo regulamentar (dias úteis sem fins de semana nem feriados da VLI).
              Permite marcar avisos manualmente na ficha ou disparar o processamento automático oficial da cobrança com registro em log.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onExecutarRotinaAutomatica();
                setLastBatchExecution('Executado agora');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap shrink-0"
              title="Disparar rotina de cobrança oficial e registrar logs nos protocolos"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Executar Cobrança Automática</span>
            </button>
          </div>
        </div>

        {/* Cadence Ruler Info */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Fluxo Padrão VLI (Dias Úteis)</span>
            </div>
            <ul className="text-slate-400 space-y-1">
              <li>· <strong className="text-amber-300">Dia útil 3:</strong> Prazo próximo do vencimento</li>
              <li>· <strong className="text-orange-300">Dia útil 5:</strong> Protocolo vence hoje</li>
              <li>· <strong className="text-rose-400">Dias úteis 7, 10, 20 e 30:</strong> Fora do prazo (Cobrança Crítica)</li>
            </ul>
          </div>

          <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              <span>Regra Especial: Vegetação Alta</span>
            </div>
            <ul className="text-slate-400 space-y-1">
              <li>· <strong className="text-slate-300">D+0:</strong> Apoio inicial (5 dias úteis) | <strong className="text-amber-300">D+3:</strong> Prazo próximo</li>
              <li>· <strong className="text-orange-300">D+5:</strong> E-mail ao manifestante e posicionamento vai para <em>Em análise</em></li>
              <li>· <strong className="text-rose-400">D+10, 20, 30, 40 e 53:</strong> Fora do prazo (se em análise)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SLA Milestones Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setSelectedMarco('todos')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedMarco === 'todos'
              ? 'bg-slate-800 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-medium text-slate-400">Todos no Prazo</div>
          <div className="mt-1 text-xl font-bold font-mono text-white tabular-nums">
            {protocolosAtivos.length}
          </div>
        </button>

        <button
          onClick={() => setSelectedMarco('d3')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedMarco === 'd3'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="text-xs font-medium text-amber-400 flex items-center justify-between">
            <span>D+3 Próximo</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-amber-300 tabular-nums">
            {marcoD3.length}
          </div>
        </button>

        <button
          onClick={() => setSelectedMarco('d5')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedMarco === 'd5'
              ? 'bg-orange-950/40 border-orange-500 ring-1 ring-orange-500'
              : 'bg-slate-900 border-slate-800 hover:border-orange-500/50'
          }`}
        >
          <div className="text-xs font-medium text-orange-400 flex items-center justify-between">
            <span>D+5 Vence Hoje</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-orange-300 tabular-nums">
            {marcoD5.length}
          </div>
        </button>

        <button
          onClick={() => setSelectedMarco('d7_plus')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedMarco === 'd7_plus'
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="text-xs font-medium text-rose-400 flex items-center justify-between">
            <span>D+7+ Fora do Prazo</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-rose-300 tabular-nums">
            {marcoD7Plus.length}
          </div>
        </button>

        <button
          onClick={() => setSelectedMarco('vegetacao')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedMarco === 'vegetacao'
              ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500'
              : 'bg-slate-900 border-slate-800 hover:border-sky-500/50'
          }`}
        >
          <div className="text-xs font-medium text-sky-400 flex items-center justify-between">
            <span>Vegetação Alta</span>
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-sky-300 tabular-nums">
            {marcoVegetacao.length}
          </div>
        </button>
      </div>

      {/* Protocols list in this milestone */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Protocolos no Marco Selecionado ({displayedProtocolos.length})
          </div>
          <div className="text-xs text-slate-400">
            Último processamento: <span className="font-mono text-slate-200">{lastBatchExecution}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {displayedProtocolos.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-emerald-400" />
              <p className="text-sm font-medium text-slate-300">Nenhum protocolo pendente neste marco no momento.</p>
              <p className="text-xs text-slate-500 mt-1">Todos os casos estão acompanhados e em dia.</p>
            </div>
          ) : (
            displayedProtocolos.map((p) => {
              const isVegetacao = p.classificacao.subtemaId === '202';
              return (
                <div
                  key={p.id}
                  className="p-4 hover:bg-slate-850 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Ticket Core Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white tracking-tight">
                        {p.numeroProtocolo}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {p.localizacao.cidadeNome} / {p.localizacao.uf} ({p.localizacao.corredor.replace('Corredor ', '')})
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-amber-400 font-medium">
                        {p.classificacao.subtemaNome}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      <strong>Manifestante:</strong> {p.manifestante.nome} ({p.manifestante.celular || p.manifestante.cpf || 'Sem contato'}) · 
                      <span className="ml-1 text-slate-400">{p.classificacao.textoDemanda}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="font-mono">Abertura: {formatarDataSimples(p.dataCriacao)}</span>
                      <span>·</span>
                      <span className="font-mono text-amber-300">Vencimento: {formatarDataSimples(p.dataVencimento)}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-200">
                        {p.diasUteisCorridos} dias úteis decorridos
                      </span>
                      <span>·</span>
                      <span className="text-slate-300">
                        Status: <strong className="text-slate-100">{p.encaminhamento.posicionamento}</strong>
                      </span>
                    </div>

                    {/* Cobranca Logs count */}
                    {p.cobrancas.length > 0 && (
                      <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                        <span className="text-slate-500">Histórico de cobrança:</span>
                        {p.cobrancas.map((cob, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-300"
                          >
                            D+{cob.diaUtil} ({cob.tipoAviso} - {cob.status})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Milestone Badge & Direct Operator Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Badge */}
                    <div className="text-right">
                      {p.diasUteisCorridos === 5 ? (
                        <div className="text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-700/80 px-2.5 py-1 rounded">
                          Vence Hoje (D+5)
                        </div>
                      ) : p.diasUteisCorridos === 3 || p.diasUteisCorridos === 4 ? (
                        <div className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-700/80 px-2.5 py-1 rounded">
                          Prazo Próximo (D+3)
                        </div>
                      ) : p.diasUteisCorridos >= 6 ? (
                        <div className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-700/80 px-2.5 py-1 rounded">
                          Fora do Prazo (D+{p.diasUteisCorridos})
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
                          No Prazo (D+{p.diasUteisCorridos})
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 mt-1">
                        {p.avisoCobrançaEnviado ? 'Aviso manual registrado' : 'Pendente de envio'}
                      </div>
                    </div>

                    {/* Action 1: Marcar aviso como enviado (manual, does not send email per doc) */}
                    <button
                      onClick={() => onMarcarAvisoManual(p.id)}
                      disabled={p.avisoCobrançaEnviado}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                        p.avisoCobrançaEnviado
                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                      }`}
                      title="Marca o aviso como enviado na ficha sem disparar e-mail (conforme item 6 do processo VLI)"
                    >
                      {p.avisoCobrançaEnviado ? 'Aviso Marcado' : 'Marcar Aviso Enviado'}
                    </button>

                    {/* Action 2: Open ticket detail */}
                    <button
                      onClick={() => onOpenProtocolo(p)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded transition-colors whitespace-nowrap"
                    >
                      Abrir Ficha
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
