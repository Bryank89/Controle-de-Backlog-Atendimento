import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  User,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  FilePlus,
  Radio,
} from 'lucide-react';
import { CanalEntrada } from '../types';

interface CallBarProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProtocoloFromCall: (callerData: {
    nome: string;
    celular: string;
    telefone: string;
    cpf: string;
    cidadeNome: string;
    canal: CanalEntrada;
  }) => void;
}

export const CallBar: React.FC<CallBarProps> = ({
  isOpen,
  onClose,
  onStartProtocoloFromCall,
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'active'>('active');
  const [secondsElapsed, setSecondsElapsed] = useState(142);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChannel, setActiveChannel] = useState<CanalEntrada>('Alô VLI 0800');

  // Pre-loaded simulated incoming caller
  const [callerName, setCallerName] = useState('Antônio Carlos de Albuquerque');
  const [callerPhone, setCallerPhone] = useState('(13) 98124-7744');
  const [callerCpf, setCallerCpf] = useState('128.455.908-11');
  const [callerCidade, setCallerCidade] = useState('Santos');

  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleSimulateNewCall = () => {
    setCallStatus('active');
    setSecondsElapsed(12);
    setCallerName('Maria de Lourdes Fontoura');
    setCallerPhone('(31) 99312-0044');
    setCallerCpf('334.891.206-88');
    setCallerCidade('Belo Horizonte');
  };

  const handleCreateProtocolo = () => {
    onStartProtocoloFromCall({
      nome: callerName,
      celular: callerPhone,
      telefone: '',
      cpf: callerCpf,
      cidadeNome: callerCidade,
      canal: activeChannel,
    });
  };

  return (
    <div className="bg-slate-950 border-b border-amber-500/30 px-4 py-3 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Call Status and Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Chamada em Andamento
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-100 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value as CanalEntrada)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5 focus:border-amber-500 outline-none"
            >
              <option value="Alô VLI 0800">Canal: Alô VLI 0800</option>
              <option value="WhatsApp">Canal: WhatsApp</option>
              <option value="Site fale conosco">Canal: Site Fale Conosco</option>
              <option value="Atendimento em Libras">Canal: Atendimento em Libras</option>
            </select>
          </div>
        </div>

        {/* Center: Manifestante Identification */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Cliente:</span>
            <span className="text-slate-100 font-semibold">{callerName}</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-300">{callerPhone}</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400 font-medium">{callerCidade}</span>
          </div>
        </div>

        {/* Script / Reminder Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/40 px-3 py-1 rounded border border-slate-800/80">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Prazo regulamentar comunicado: <strong className="text-slate-200">5 dias úteis</strong></span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded text-xs border transition-colors ${
              isMuted
                ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Desmutar microfone' : 'Mutar microfone'}
          >
            {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCreateProtocolo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors shadow-sm"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Registrar Protocolo desta Ligação</span>
          </button>

          <button
            onClick={handleSimulateNewCall}
            title="Simular outra chamada recebida"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition-colors"
          >
            Outra Chamada
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Recolher softphone"
          >
            <PhoneOff className="w-4 h-4 text-slate-400 hover:text-rose-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
