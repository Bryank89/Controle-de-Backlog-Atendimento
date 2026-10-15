import React, { useState, useMemo } from 'react';
import {
  TopNavbar,
} from './components/TopNavbar';
import { CallBar } from './components/CallBar';
import { BacklogView } from './components/BacklogView';
import { VencimentosCobrancaView } from './components/VencimentosCobrancaView';
import { ReincidenciaModal } from './components/ReincidenciaModal';
import { CadastrosModal } from './components/CadastrosModal';
import { ProtocolFormModal } from './components/ProtocolFormModal';
import { CanalEntrada, ProtocoloVLI } from './types';
import { criarProtocolosIniciais } from './data/mockData';
import { CheckCircle, AlertCircle, Info, Sparkles, Layers } from 'lucide-react';
import { formatarDataSimples } from './utils/slaEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'backlog' | 'vencimentos' | 'reincidencia' | 'cadastros'>('backlog');
  const [protocolos, setProtocolos] = useState<ProtocoloVLI[]>(criarProtocolosIniciais());
  const [isCallBarOpen, setIsCallBarOpen] = useState(true);
  const [operatorName] = useState('operador.mariana');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProtocolo, setSelectedProtocolo] = useState<ProtocoloVLI | null>(null);
  const [callerInitialData, setCallerInitialData] = useState<{
    nome: string;
    celular: string;
    telefone: string;
    cpf: string;
    cidadeNome: string;
    canal: CanalEntrada;
  } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Metrics for Topbar
  const totalBacklogCount = useMemo(() => {
    return protocolos.filter((p) => p.encaminhamento.posicionamento !== 'Fechado').length;
  }, [protocolos]);

  const criticosCount = useMemo(() => {
    return protocolos.filter(
      (p) =>
        (p.statusSla === 'Vence hoje' || p.statusSla === 'Fora do prazo') &&
        p.encaminhamento.posicionamento !== 'Fechado'
    ).length;
  }, [protocolos]);

  // Handler: Open empty form for new ticket
  const handleOpenNovo = () => {
    setSelectedProtocolo(null);
    setCallerInitialData(null);
    setIsModalOpen(true);
  };

  // Handler: Open ticket from live call
  const handleStartFromCall = (callerData: {
    nome: string;
    celular: string;
    telefone: string;
    cpf: string;
    cidadeNome: string;
    canal: CanalEntrada;
  }) => {
    setSelectedProtocolo(null);
    setCallerInitialData(callerData);
    setIsModalOpen(true);
    showToast(`Atendimento iniciado via ${callerData.canal}. Dados do manifestante transferidos para a ficha.`);
  };

  // Handler: Open existing ticket
  const handleOpenProtocolo = (protocolo: ProtocoloVLI) => {
    setSelectedProtocolo(protocolo);
    setCallerInitialData(null);
    setIsModalOpen(true);
  };

  // Handler: Save or Update Protocol
  const handleSalvarProtocolo = (protocoloAtualizado: ProtocoloVLI) => {
    setProtocolos((prev) => {
      const index = prev.findIndex((p) => p.id === protocoloAtualizado.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = protocoloAtualizado;
        return copy;
      } else {
        return [protocoloAtualizado, ...prev];
      }
    });

    if (protocoloAtualizado.encaminhamento.emailEnviado && !selectedProtocolo?.encaminhamento.emailEnviado) {
      showToast(
        `Protocolo #${protocoloAtualizado.numeroProtocolo} salvo! E-mail de encaminhamento disparado com sucesso para a equipe técnica.`
      );
    } else {
      showToast(`Protocolo #${protocoloAtualizado.numeroProtocolo} salvo com sucesso no banco de dados.`);
    }
  };

  // Handler: Manual notice mark (Item 6: Tela de vencimentos permite marcar aviso sem disparar email)
  const handleMarcarAvisoManual = (protocoloId: string) => {
    setProtocolos((prev) =>
      prev.map((p) => {
        if (p.id === protocoloId) {
          return {
            ...p,
            avisoCobrançaEnviado: true,
            cobrancas: [
              ...p.cobrancas,
              {
                id: `cob-${Date.now()}`,
                dataHora: new Date().toISOString(),
                diaUtil: p.diasUteisCorridos,
                tipoAviso: `Aviso D+${p.diasUteisCorridos} registrado manualmente`,
                destinatarios: p.encaminhamento.emailsDestinatarios || [],
                enviadoPor: 'Operador',
                status: 'Marcado Manual',
              },
            ],
          };
        }
        return p;
      })
    );
    showToast('Aviso de cobrança marcado manualmente como enviado na ficha do protocolo.');
  };

  // Handler: Automated batch run (Item 6: Processamento automático envia avisos e grava log da cobrança)
  const handleExecutarRotinaAutomatica = () => {
    let afetados = 0;
    setProtocolos((prev) =>
      prev.map((p) => {
        if (p.encaminhamento.posicionamento === 'Fechado') return p;

        let novoPosicionamento = p.encaminhamento.posicionamento;
        let novoLog = false;
        let tipoAviso = '';

        // Regra especial Vegetação alta D+5
        if (p.classificacao.subtemaId === '202' && p.diasUteisCorridos >= 5 && p.encaminhamento.posicionamento === 'Pendente') {
          novoPosicionamento = 'Em análise';
          tipoAviso = 'D+5: Notificação do manifestante & Mudança para Em análise';
          novoLog = true;
        } else if (p.diasUteisCorridos === 3) {
          tipoAviso = 'D+3: Prazo próximo do vencimento';
          novoLog = true;
        } else if (p.diasUteisCorridos === 5) {
          tipoAviso = 'D+5: Protocolo vence hoje';
          novoLog = true;
        } else if (p.diasUteisCorridos >= 6) {
          tipoAviso = `D+${p.diasUteisCorridos}: Fora do prazo (Cobrança Crítica)`;
          novoLog = true;
        }

        if (novoLog) {
          afetados++;
          return {
            ...p,
            encaminhamento: {
              ...p.encaminhamento,
              posicionamento: novoPosicionamento,
            },
            cobrancas: [
              ...p.cobrancas,
              {
                id: `cob-${Date.now()}-${p.id}`,
                dataHora: new Date().toISOString(),
                diaUtil: p.diasUteisCorridos,
                tipoAviso,
                destinatarios: p.encaminhamento.emailsDestinatarios || [],
                enviadoPor: 'Automático',
                status: 'Enviado',
              },
            ],
          };
        }
        return p;
      })
    );
    showToast(`Processamento oficial concluído: ${afetados} protocolos notificados e registrados em log.`);
  };

  // Handler: Export to CSV (Excel compatible with UTF-8 BOM)
  const handleExportExcel = () => {
    const headers = [
      'Protocolo',
      'Data Abertura',
      'Data Vencimento',
      'Dias Uteis',
      'Status SLA',
      'Canal',
      'Manifestante Nome',
      'CPF',
      'Celular',
      'Telefone',
      'Email',
      'Cidade',
      'UF',
      'Corredor',
      'Bairro',
      'Endereco',
      'KM',
      'SB',
      'Tipo',
      'Orgao',
      'Tema',
      'Subtema',
      'Ativo',
      'Reincidencia',
      'Encaminhado',
      'Conhecimento',
      'Posicionamento',
      'Email Enviado',
      'Texto Demanda',
    ];

    const rows = protocolos.map((p) => [
      `"${p.numeroProtocolo}"`,
      `"${formatarDataSimples(p.dataCriacao)}"`,
      `"${formatarDataSimples(p.dataVencimento)}"`,
      p.diasUteisCorridos,
      `"${p.statusSla}"`,
      `"${p.canal}"`,
      `"${p.manifestante.nome.replace(/"/g, '""')}"`,
      `"${p.manifestante.cpf}"`,
      `"${p.manifestante.celular}"`,
      `"${p.manifestante.telefone}"`,
      `"${p.manifestante.email}"`,
      `"${p.localizacao.cidadeNome}"`,
      `"${p.localizacao.uf}"`,
      `"${p.localizacao.corredor}"`,
      `"${p.localizacao.bairro.replace(/"/g, '""')}"`,
      `"${p.localizacao.endereco.replace(/"/g, '""')}"`,
      `"${p.localizacao.km || ''}"`,
      `"${p.localizacao.sb || ''}"`,
      `"${p.classificacao.tipo}"`,
      `"${p.classificacao.orgao}"`,
      `"${p.classificacao.temaNome}"`,
      `"${p.classificacao.subtemaNome}"`,
      `"${p.classificacao.ativo}"`,
      `"${p.classificacao.reincidencia}"`,
      `"${p.encaminhamento.encaminhado}"`,
      `"${p.encaminhamento.conhecimento}"`,
      `"${p.encaminhamento.posicionamento}"`,
      `"${p.encaminhamento.emailEnviado ? 'Sim' : 'Não'}"`,
      `"${p.classificacao.textoDemanda.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dataHoje = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.setAttribute('download', `base_backlog_vli_${dataHoje}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha de backlog exportada com sucesso (formato Excel / CSV).');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <TopNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNovoProtocolo={handleOpenNovo}
        operatorName={operatorName}
        isCallActive={isCallBarOpen}
        onToggleCallBar={() => setIsCallBarOpen(!isCallBarOpen)}
        totalBacklogCount={totalBacklogCount}
        criticosCount={criticosCount}
      />

      {/* Operator Live Call Softphone Header Bar */}
      <CallBar
        isOpen={isCallBarOpen}
        onClose={() => setIsCallBarOpen(false)}
        onStartProtocoloFromCall={handleStartFromCall}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-500/80 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'backlog' && (
          <BacklogView
            protocolos={protocolos}
            onOpenProtocolo={handleOpenProtocolo}
            onOpenNovo={handleOpenNovo}
            onExportExcel={handleExportExcel}
          />
        )}

        {currentTab === 'vencimentos' && (
          <VencimentosCobrancaView
            protocolos={protocolos}
            onMarcarAvisoManual={handleMarcarAvisoManual}
            onExecutarRotinaAutomatica={handleExecutarRotinaAutomatica}
            onOpenProtocolo={handleOpenProtocolo}
          />
        )}

        {currentTab === 'reincidencia' && (
          <ReincidenciaModal
            protocolos={protocolos}
            onOpenProtocolo={handleOpenProtocolo}
          />
        )}

        {currentTab === 'cadastros' && <CadastrosModal />}
      </main>

      {/* Protocol Form & Operator Attendance Sheet Modal */}
      <ProtocolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        protocoloExistente={selectedProtocolo}
        initialCallerData={callerInitialData}
        onSalvarProtocolo={handleSalvarProtocolo}
        todosProtocolos={protocolos}
        usuarioOperador={operatorName}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">ComunicaContactCenter</span>
          <span>·</span>
          <span>Campanha Alô VLI (Ferrovia, Portos e Terminais)</span>
        </div>
        <div className="text-slate-500">
          SLA Regulamentar: 5 dias úteis · Sistema de Backlog & Roteamento Integrado
        </div>
      </footer>
    </div>
  );
}
