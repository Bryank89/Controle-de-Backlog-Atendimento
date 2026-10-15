import React from 'react';
import {
  PhoneCall,
  PlusCircle,
  Clock,
  Search,
  Database,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface TopNavbarProps {
  currentTab: 'backlog' | 'vencimentos' | 'reincidencia' | 'cadastros';
  onSelectTab: (tab: 'backlog' | 'vencimentos' | 'reincidencia' | 'cadastros') => void;
  onOpenNovoProtocolo: () => void;
  operatorName: string;
  isCallActive: boolean;
  onToggleCallBar: () => void;
  totalBacklogCount: number;
  criticosCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNovoProtocolo,
  operatorName,
  isCallActive,
  onToggleCallBar,
  totalBacklogCount,
  criticosCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Strict 3-zone contract: Zone 1 (Wordmark), Zone 2 (Nav links), Zone 3 (Primary action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-amber-500/20">
              VLI
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block leading-tight">
                ComunicaContactCenter
              </span>
              <span className="text-xs text-amber-400/90 font-medium tracking-wide">
                Campanha Alô VLI · Backlog & Operação
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line unboxed text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('backlog')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentTab === 'backlog'
                ? 'text-white border-amber-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Backlog Operacional</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {totalBacklogCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('vencimentos')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentTab === 'vencimentos'
                ? 'text-white border-amber-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Vencimentos & Cobrança</span>
            {criticosCount > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
                {criticosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('reincidencia')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentTab === 'reincidencia'
                ? 'text-white border-amber-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Busca Reincidência</span>
          </button>

          <button
            onClick={() => onSelectTab('cadastros')}
            className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentTab === 'cadastros'
                ? 'text-white border-amber-500 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>Mailing & Cadastros</span>
          </button>
        </nav>

        {/* Zone 3: Operator Status & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Operator Call softphone toggle */}
          <button
            onClick={onToggleCallBar}
            title="Alternar barra de atendimento telefônico"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              isCallActive
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <PhoneCall className={`w-3.5 h-3.5 ${isCallActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {isCallActive ? 'Chamada Alô VLI Ativa' : 'Softphone 0800'}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNovoProtocolo}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors shadow-sm shadow-amber-500/20 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Abrir Protocolo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
