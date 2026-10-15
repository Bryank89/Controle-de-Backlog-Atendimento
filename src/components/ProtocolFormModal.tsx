import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  Paperclip,
  Clock,
  User,
  MapPin,
  Train,
  Tag,
  ShieldAlert,
  FileText,
  History,
  MessageSquare,
  Plus,
  HelpCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  CanalEntrada,
  CidadeConfig,
  Classificacao,
  EncaminhamentoInfo,
  InteracaoAtendimento,
  Localizacao,
  Manifestante,
  ProtocoloVLI,
  TipoManifestacao,
  TipoOrgao,
  AtivoVLI,
  ReincidenciaTipo,
  EncaminhadoStatus,
  ConhecimentoStatus,
  PosicionamentoStatus,
  AnexoArquivo,
} from '../types';
import { CIDADES_VLI, TEMAS_VLI, SUBTEMAS_VLI, MAILING_RESPONDENTES } from '../data/mockData';
import {
  adicionarDiasUteis,
  formatarDataHora,
  formatarDataSimples,
  gerarNumeroProtocolo,
  resolverDestinatariosEncaminhamento,
  subtemaExigeKmSb,
  sugerirPosicionamento,
} from '../utils/slaEngine';

interface ProtocolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocoloExistente: ProtocoloVLI | null;
  initialCallerData?: {
    nome: string;
    celular: string;
    telefone: string;
    cpf: string;
    cidadeNome: string;
    canal: CanalEntrada;
  } | null;
  onSalvarProtocolo: (protocolo: ProtocoloVLI) => void;
  todosProtocolos: ProtocoloVLI[];
  usuarioOperador: string;
}

export const ProtocolFormModal: React.FC<ProtocolFormModalProps> = ({
  isOpen,
  onClose,
  protocoloExistente,
  initialCallerData,
  onSalvarProtocolo,
  todosProtocolos,
  usuarioOperador,
}) => {
  const [activeTab, setActiveTab] = useState<'ficha' | 'interacoes' | 'anexos' | 'auditoria' | 'email'>('ficha');

  // Form State
  const [isNovoRegistro, setIsNovoRegistro] = useState(true);
  const [numeroProtocolo, setNumeroProtocolo] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [canal, setCanal] = useState<CanalEntrada>('Alô VLI 0800');

  // Manifestante
  const [manifestante, setManifestante] = useState<Manifestante>({
    nome: '',
    email: '',
    celular: '',
    telefone: '',
    cpf: '',
  });

  // Localização
  const [cidadeId, setCidadeId] = useState<string>('cid-01');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [km, setKm] = useState('');
  const [sb, setSb] = useState('');

  // Classificação
  const [tipo, setTipo] = useState<TipoManifestacao | ''>('');
  const [orgao, setOrgao] = useState<TipoOrgao | ''>('Pessoa Física');
  const [temaId, setTemaId] = useState<string>('1');
  const [subtemaId, setSubtemaId] = useState<string>('101');
  const [ativo, setAtivo] = useState<AtivoVLI>('Ferrovia');
  const [reincidencia, setReincidencia] = useState<ReincidenciaTipo>('Primeiro contato');
  const [textoDemanda, setTextoDemanda] = useState('');
  const [respostaFinal, setRespostaFinal] = useState('');

  // Encaminhamento
  const [encaminhado, setEncaminhado] = useState<EncaminhadoStatus>('Sim');
  const [conhecimento, setConhecimento] = useState<ConhecimentoStatus>('Não');
  const [posicionamento, setPosicionamento] = useState<PosicionamentoStatus>('Pendente');
  const [emailJaDisparado, setEmailJaDisparado] = useState(false);

  // Extras
  const [interacoes, setInteracoes] = useState<InteracaoAtendimento[]>([]);
  const [anexos, setAnexos] = useState<AnexoArquivo[]>([]);
  const [novaInteracaoTexto, setNovaInteracaoTexto] = useState('');
  const [tipoNovaInteracao, setTipoNovaInteracao] = useState<InteracaoAtendimento['tipo']>('Registro do Operador');
  const [simularAnexoNome, setSimularAnexoNome] = useState('');
  const [simularAnexoMb, setSimularAnexoMb] = useState<number>(2.5);

  // Error flags
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tipoInicialNoBanco, setTipoInicialNoBanco] = useState<TipoManifestacao | ''>('');

  // Initialize or Load Form
  useEffect(() => {
    if (!isOpen) return;

    if (protocoloExistente) {
      setIsNovoRegistro(false);
      setNumeroProtocolo(protocoloExistente.numeroProtocolo);
      setDataCriacao(protocoloExistente.dataCriacao);
      setDataVencimento(protocoloExistente.dataVencimento);
      setCanal(protocoloExistente.canal);
      setManifestante({ ...protocoloExistente.manifestante });

      setCidadeId(protocoloExistente.localizacao.cidadeId);
      setBairro(protocoloExistente.localizacao.bairro);
      setEndereco(protocoloExistente.localizacao.endereco);
      setCep(protocoloExistente.localizacao.cep);
      setPontoReferencia(protocoloExistente.localizacao.pontoReferencia);
      setKm(protocoloExistente.localizacao.km);
      setSb(protocoloExistente.localizacao.sb);

      setTipo(protocoloExistente.classificacao.tipo);
      setTipoInicialNoBanco(protocoloExistente.classificacao.tipo);
      setOrgao(protocoloExistente.classificacao.orgao);
      setTemaId(protocoloExistente.classificacao.temaId);
      setSubtemaId(protocoloExistente.classificacao.subtemaId);
      setAtivo(protocoloExistente.classificacao.ativo);
      setReincidencia(protocoloExistente.classificacao.reincidencia);
      setTextoDemanda(protocoloExistente.classificacao.textoDemanda);
      setRespostaFinal(protocoloExistente.classificacao.respostaFinal);

      setEncaminhado(protocoloExistente.encaminhamento.encaminhado);
      setConhecimento(protocoloExistente.encaminhamento.conhecimento);
      setPosicionamento(protocoloExistente.encaminhamento.posicionamento);
      setEmailJaDisparado(protocoloExistente.encaminhamento.emailEnviado);

      setInteracoes(protocoloExistente.interacoes || []);
      setAnexos(protocoloExistente.anexos || []);
    } else {
      // Novo Protocolo
      setIsNovoRegistro(true);
      const agora = new Date();
      const num = gerarNumeroProtocolo(agora);
      const venc = adicionarDiasUteis(agora, 5);

      setNumeroProtocolo(num);
      setDataCriacao(agora.toISOString());
      setDataVencimento(venc.toISOString());
      setCanal(initialCallerData?.canal || 'Alô VLI 0800');
      setTipo('');
      setTipoInicialNoBanco('');
      setOrgao('Pessoa Física');
      setTemaId('1');
      setSubtemaId('101');
      setAtivo('Ferrovia');
      setReincidencia('Primeiro contato');
      setTextoDemanda('');
      setRespostaFinal('');

      setEncaminhado('Sim');
      setConhecimento('Não');
      setPosicionamento('Pendente');
      setEmailJaDisparado(false);
      setInteracoes([]);
      setAnexos([]);

      if (initialCallerData) {
        setManifestante({
          nome: initialCallerData.nome || '',
          email: '',
          celular: initialCallerData.celular || '',
          telefone: initialCallerData.telefone || '',
          cpf: initialCallerData.cpf || '',
        });

        const cidMatch = CIDADES_VLI.find(
          (c) => c.nome.toLowerCase() === initialCallerData.cidadeNome?.toLowerCase()
        );
        if (cidMatch) {
          setCidadeId(cidMatch.id);
        } else {
          setCidadeId('cid-01');
        }
      } else {
        setManifestante({
          nome: '',
          email: '',
          celular: '',
          telefone: '',
          cpf: '',
        });
        setCidadeId('cid-01');
      }
      setBairro('');
      setEndereco('');
      setCep('');
      setPontoReferencia('');
      setKm('');
      setSb('');
    }
    setValidationErrors([]);
    setActiveTab('ficha');
  }, [isOpen, protocoloExistente, initialCallerData]);

  // Derived Cidade & Corredor
  const cidadeSelecionada = useMemo(() => {
    return CIDADES_VLI.find((c) => c.id === cidadeId) || CIDADES_VLI[0];
  }, [cidadeId]);

  const corredorAtual = cidadeSelecionada.corredor;

  // Filter Subtemas by Tema
  const subtemasDoTema = useMemo(() => {
    return SUBTEMAS_VLI.filter((s) => s.temaId === temaId);
  }, [temaId]);

  // Check if current subtema requires KM and SB
  const exigeKmSb = useMemo(() => {
    return subtemaExigeKmSb(subtemaId);
  }, [subtemaId]);

  // Handle Encaminhado changes -> If Não, Conhecimento becomes Não se aplica
  const handleEncaminhadoChange = (val: EncaminhadoStatus) => {
    setEncaminhado(val);
    const novoConhecimento = val === 'Não' ? 'Não se aplica' : conhecimento === 'Não se aplica' ? 'Não' : conhecimento;
    setConhecimento(novoConhecimento);
    const sug = sugerirPosicionamento(subtemaId, val, novoConhecimento);
    setPosicionamento(sug);
  };

  const handleConhecimentoChange = (val: ConhecimentoStatus) => {
    setConhecimento(val);
    const sug = sugerirPosicionamento(subtemaId, encaminhado, val);
    setPosicionamento(sug);
  };

  const handleSubtemaChange = (novoSubId: string) => {
    setSubtemaId(novoSubId);
    const sug = sugerirPosicionamento(novoSubId, encaminhado, conhecimento);
    setPosicionamento(sug);
  };

  // Reincidência Detection in real-time
  const reincidenciaDetectada = useMemo(() => {
    const cpfClean = manifestante.cpf.replace(/\D/g, '');
    const celClean = manifestante.celular.replace(/\D/g, '');

    if (cpfClean.length < 5 && celClean.length < 5 && !bairro.trim()) {
      return null;
    }

    const matches = todosProtocolos.filter((p) => {
      if (protocoloExistente && p.id === protocoloExistente.id) return false;

      const pCpf = p.manifestante.cpf.replace(/\D/g, '');
      const pCel = p.manifestante.celular.replace(/\D/g, '');

      // Direct match on CPF or Celular
      if (cpfClean.length >= 8 && pCpf === cpfClean) return true;
      if (celClean.length >= 8 && pCel === celClean) return true;

      // Cross match: same Bairro + same Subtema within 5 business days
      if (
        bairro.trim() &&
        p.localizacao.bairro.toLowerCase() === bairro.trim().toLowerCase() &&
        p.classificacao.subtemaId === subtemaId &&
        p.diasUteisCorridos <= 5
      ) {
        return true;
      }

      return false;
    });

    return matches.length > 0 ? matches[0] : null;
  }, [manifestante.cpf, manifestante.celular, bairro, subtemaId, todosProtocolos, protocoloExistente]);

  // Auto-mark reincidência flag if match detected
  useEffect(() => {
    if (reincidenciaDetectada && reincidencia === 'Primeiro contato') {
      setReincidencia('Reincidência');
    }
  }, [reincidenciaDetectada, reincidencia]);

  // Routing Preview (Destinatários)
  const roteamento = useMemo(() => {
    return resolverDestinatariosEncaminhamento(
      cidadeSelecionada,
      corredorAtual,
      orgao,
      temaId,
      subtemaId,
      MAILING_RESPONDENTES
    );
  }, [cidadeSelecionada, corredorAtual, orgao, temaId, subtemaId]);

  // Email Subject & Body
  const temaNome = TEMAS_VLI.find((t) => t.id === temaId)?.nome || '';
  const assuntoEmailCalculado = `[${tipo || 'Manifestação'}] Alô VLI - ${temaNome} - Protocolo ${numeroProtocolo}`;
  const corpoEmailCalculado =
    conhecimento === 'Sim'
      ? `Prezados,\n\nA manifestação registrada pelo canal ${canal} segue APENAS PARA CONHECIMENTO.\n\nProtocolo: ${numeroProtocolo}\nCidade: ${cidadeSelecionada.nome} / ${cidadeSelecionada.uf} (${corredorAtual})\nManifestante: ${manifestante.nome}\nDemanda: ${textoDemanda || '(Sem descrição)'}\n\nAtenciosamente,\nEquipe Alô VLI - ComunicaContactCenter`
      : `Prezados,\n\nSolicitamos apoio da área responsável para elaboração de resposta técnica à demanda abaixo, com PRAZO REGULAMENTAR DE 5 DIAS ÚTEIS.\n\nProtocolo: ${numeroProtocolo}\nCidade: ${cidadeSelecionada.nome} / ${cidadeSelecionada.uf} (${corredorAtual})\nKM/SB: ${km || '-'} / ${sb || '-'}\nManifestante: ${manifestante.nome}\nContato: ${manifestante.celular || manifestante.telefone || manifestante.email}\nDemanda: ${textoDemanda || '(Sem descrição)'}\n\nAtenciosamente,\nEquipe Alô VLI - ComunicaContactCenter`;

  // Attachments total MB
  const totalAnexosMb = useMemo(() => {
    return anexos.reduce((acc, curr) => acc + curr.tamanhoMb, 0);
  }, [anexos]);

  // Check email dispatch condition (Item 5 do processo)
  // O e-mail parte no primeiro salvamento em que:
  // 1) o registro já existe (não é a geração do protocolo)
  // 2) Encaminhado está como sim
  // 3) o tipo ainda estava vazio no banco
  const condicaoDisparoEmailAtendida = useMemo(() => {
    const jaExisteRegistro = !isNovoRegistro;
    const isEncaminhadoSim = encaminhado === 'Sim';
    const tipoEstavaVazio = !tipoInicialNoBanco;
    const tipoAgoraPreenchido = Boolean(tipo);

    return jaExisteRegistro && isEncaminhadoSim && tipoEstavaVazio && tipoAgoraPreenchido && !emailJaDisparado;
  }, [isNovoRegistro, encaminhado, tipoInicialNoBanco, tipo, emailJaDisparado]);

  // Save / Submit Protocol Handler
  const handleSave = () => {
    const errors: string[] = [];

    if (!manifestante.nome.trim()) {
      errors.push('Nome do manifestante é obrigatório.');
    }
    if (!cidadeId) {
      errors.push('Selecione uma Cidade.');
    }
    if (!tipo) {
      errors.push('Selecione o Tipo da manifestação.');
    }
    if (!temaId || !subtemaId) {
      errors.push('Selecione Tema e Subtema.');
    }

    // KM and SB mandatory check
    if (exigeKmSb) {
      if (!km.trim()) {
        errors.push(`O subtema "${SUBTEMAS_VLI.find((s) => s.id === subtemaId)?.nome}" EXIGE o preenchimento do KM.`);
      }
      if (!sb.trim()) {
        errors.push(`O subtema "${SUBTEMAS_VLI.find((s) => s.id === subtemaId)?.nome}" EXIGE o preenchimento do SB (Sub-trecho).`);
      }
    }

    // Attachment limit 25MB check
    if (totalAnexosMb > 25) {
      errors.push(`O total de anexos (${totalAnexosMb.toFixed(1)} MB) excede o limite máximo de 25 MB.`);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setActiveTab('ficha');
      return;
    }

    // Determine final email dispatch state
    let novoEmailEnviado = emailJaDisparado;
    let dataEnvioEmail = protocoloExistente?.encaminhamento.dataEnvioEmail;
    if (condicaoDisparoEmailAtendida) {
      novoEmailEnviado = true;
      dataEnvioEmail = new Date().toISOString();
    }

    // If closing, set dataFinalizacao if empty
    let dataFinal = protocoloExistente?.dataFinalizacao;
    if (posicionamento === 'Fechado' && !dataFinal) {
      dataFinal = new Date().toISOString();
    }

    const subtemaObj = SUBTEMAS_VLI.find((s) => s.id === subtemaId);
    const temaObj = TEMAS_VLI.find((t) => t.id === temaId);

    const protocoloSalvo: ProtocoloVLI = {
      id: protocoloExistente ? protocoloExistente.id : `proto-${Date.now()}`,
      numeroProtocolo,
      dataCriacao,
      dataVencimento,
      dataFinalizacao: dataFinal,
      usuarioAbertura: protocoloExistente ? protocoloExistente.usuarioAbertura : `${usuarioOperador} (ComunicaContactCenter)`,
      canal,
      manifestante: { ...manifestante },
      localizacao: {
        cidadeId,
        cidadeNome: cidadeSelecionada.nome,
        uf: cidadeSelecionada.uf,
        corredor: corredorAtual,
        bairro,
        endereco,
        cep,
        pontoReferencia,
        km,
        sb,
      },
      classificacao: {
        tipo,
        orgao,
        temaId,
        temaNome: temaObj?.nome || '',
        subtemaId,
        subtemaNome: subtemaObj?.nome || '',
        ativo,
        reincidencia,
        textoDemanda,
        respostaFinal,
      },
      encaminhamento: {
        encaminhado,
        conhecimento,
        posicionamento,
        emailEnviado: novoEmailEnviado,
        dataEnvioEmail,
        emailsDestinatarios: roteamento.emailsFinais,
        assuntoEmail: assuntoEmailCalculado,
        conteudoEmail: corpoEmailCalculado,
      },
      interacoes: [...interacoes],
      anexos: [...anexos],
      logs: [
        ...(protocoloExistente?.logs || []),
        {
          id: `log-${Date.now()}`,
          dataHora: new Date().toISOString(),
          usuario: usuarioOperador,
          campo: isNovoRegistro ? 'Criação do Protocolo' : 'Edição / Posicionamento',
          valorAnterior: protocoloExistente ? protocoloExistente.encaminhamento.posicionamento : '-',
          valorNovo: `${posicionamento} (Encaminhado: ${encaminhado}, Conhecimento: ${conhecimento})`,
        },
      ],
      cobrancas: protocoloExistente?.cobrancas || [],
      diasUteisCorridos: protocoloExistente?.diasUteisCorridos || 0,
      statusSla: protocoloExistente?.statusSla || 'No prazo',
      avisoCobrançaEnviado: protocoloExistente?.avisoCobrançaEnviado || false,
    };

    onSalvarProtocolo(protocoloSalvo);
    onClose();
  };

  const handleAddInteracao = () => {
    if (!novaInteracaoTexto.trim()) return;
    const nova: InteracaoAtendimento = {
      id: `int-${Date.now()}`,
      dataHora: new Date().toISOString(),
      usuario: usuarioOperador,
      perfil: 'Operador Alô VLI',
      tipo: tipoNovaInteracao,
      descricao: novaInteracaoTexto.trim(),
    };
    setInteracoes([nova, ...interacoes]);
    setNovaInteracaoTexto('');
  };

  const handleAddAnexo = () => {
    if (!simularAnexoNome.trim()) return;
    const novoAnx: AnexoArquivo = {
      id: `anx-${Date.now()}`,
      nome: simularAnexoNome.trim(),
      tamanhoMb: simularAnexoMb,
      dataUpload: new Date().toISOString(),
      usuario: usuarioOperador,
      tipo: simularAnexoNome.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    };
    setAnexos([...anexos, novoAnx]);
    setSimularAnexoNome('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {isNovoRegistro ? 'Abertura de Protocolo VLI' : 'Tratamento de Protocolo'}
              </span>
            </div>

            <span className="text-slate-600">·</span>

            <span className="font-mono text-base font-bold text-white tracking-tight">
              #{numeroProtocolo}
            </span>

            <span className="text-slate-600">·</span>

            <span className="text-xs text-slate-400 font-mono">
              Abertura: {formatarDataHora(dataCriacao)}
            </span>

            <span className="text-slate-600">·</span>

            <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
              SLA 5 Dias Úteis: Vence {formatarDataSimples(dataVencimento)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reincidência Smart Alert Banner */}
        {reincidenciaDetectada && (
          <div className="bg-amber-950/80 border-b border-amber-600/70 px-5 py-2.5 flex items-center justify-between text-xs text-amber-200 gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong>Atenção ao Operador:</strong> Reincidência detectada para este manifestante!
                Protocolo anterior <span className="font-mono font-bold text-white">#{reincidenciaDetectada.numeroProtocolo}</span> ({reincidenciaDetectada.classificacao.subtemaNome}) aberto em {formatarDataSimples(reincidenciaDetectada.dataCriacao)}.
              </div>
            </div>
            <button
              onClick={() => setReincidencia('Reincidência')}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] whitespace-nowrap"
            >
              Confirmar Reincidência
            </button>
          </div>
        )}

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 && (
          <div className="bg-rose-950/90 border-b border-rose-700 px-5 py-2.5 text-xs text-rose-200">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Por favor, corrija os seguintes itens obrigatórios:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 px-5 border-b border-slate-800 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('ficha')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ficha'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ficha de Atendimento</span>
          </button>

          <button
            onClick={() => setActiveTab('interacoes')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'interacoes'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interações ({interacoes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('anexos')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'anexos'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Anexos ({anexos.length}) · {totalAnexosMb.toFixed(1)}/25 MB</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'email'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Roteamento & E-mail {emailJaDisparado ? '(Enviado)' : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'auditoria'
                ? 'border-amber-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Log de Alterações</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: FICHA DE ATENDIMENTO */}
          {activeTab === 'ficha' && (
            <div className="space-y-6">
              {/* Row 1: Canal de Entrada e Dados do Manifestante */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    <span>1. Dados do Manifestante & Canal de Entrada</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Canal de Entrada:</span>
                    <select
                      value={canal}
                      onChange={(e) => setCanal(e.target.value as CanalEntrada)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-semibold focus:border-amber-500 outline-none"
                    >
                      <option value="Alô VLI 0800">Alô VLI 0800</option>
                      <option value="Site fale conosco">Site fale conosco</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Atendimento em Libras">Atendimento em Libras</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={manifestante.nome}
                      onChange={(e) => setManifestante({ ...manifestante, nome: e.target.value })}
                      placeholder="Nome do cidadão / solicitante"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">CPF (Localiza Reincidência)</label>
                    <input
                      type="text"
                      value={manifestante.cpf}
                      onChange={(e) => setManifestante({ ...manifestante, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white font-mono placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Celular (Localiza Reincidência)</label>
                    <input
                      type="text"
                      value={manifestante.celular}
                      onChange={(e) => setManifestante({ ...manifestante, celular: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white font-mono placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Telefone Fixo</label>
                    <input
                      type="text"
                      value={manifestante.telefone}
                      onChange={(e) => setManifestante({ ...manifestante, telefone: e.target.value })}
                      placeholder="(00) 0000-0000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white font-mono placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">E-mail para Retorno</label>
                    <input
                      type="email"
                      value={manifestante.email}
                      onChange={(e) => setManifestante({ ...manifestante, email: e.target.value })}
                      placeholder="exemplo@email.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Dados do Local & Corredor Automático */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>2. Dados do Local da Manifestação</span>
                  </h3>
                  <div className="text-xs font-medium text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
                    Corredor Derivado: <strong>{corredorAtual}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Cidade da Manifestação *</label>
                    <select
                      value={cidadeId}
                      onChange={(e) => setCidadeId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:border-amber-500 outline-none"
                    >
                      {CIDADES_VLI.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome} / {c.uf}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Ex: Barreiro, Porto Alemoa..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Endereço e Número</label>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, avenida ou trecho ferroviário"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white font-mono placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Ponto de Referência</label>
                    <input
                      type="text"
                      value={pontoReferencia}
                      onChange={(e) => setPontoReferencia(e.target.value)}
                      placeholder="Cruzamento, viaduto, escola..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* KM and SB mandatory indicator */}
                  <div>
                    <label className="block text-slate-400 mb-1">
                      KM Ferroviário {exigeKmSb && <span className="text-rose-400 font-bold">* (Obrigatório)</span>}
                    </label>
                    <input
                      type="text"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                      placeholder="Ex: 412+350"
                      className={`w-full bg-slate-900 border rounded-md px-3 py-1.5 text-white font-mono focus:outline-none ${
                        exigeKmSb && !km.trim() ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      SB (Sub-trecho / Sub-bloco) {exigeKmSb && <span className="text-rose-400 font-bold">* (Obrigatório)</span>}
                    </label>
                    <input
                      type="text"
                      value={sb}
                      onChange={(e) => setSb(e.target.value)}
                      placeholder="Ex: SB-01 Barreiro"
                      className={`w-full bg-slate-900 border rounded-md px-3 py-1.5 text-white font-mono focus:outline-none ${
                        exigeKmSb && !sb.trim() ? 'border-rose-500 bg-rose-950/20' : 'border-slate-700 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {exigeKmSb && (
                  <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Regra VLI: Este subtema exige a localização exata por KM e SB para vistoria em campo pela engenharia.</span>
                  </div>
                )}
              </div>

              {/* Row 3: Classificação do Atendimento */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>3. Classificação da Manifestação</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tipo da Manifestação *</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoManifestacao)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-semibold focus:border-amber-500 outline-none"
                    >
                      <option value="">Selecione o Tipo...</option>
                      <option value="Reclamação">Reclamação</option>
                      <option value="Solicitação">Solicitação</option>
                      <option value="Denúncia">Denúncia</option>
                      <option value="Informação">Informação</option>
                      <option value="Anomalia">Anomalia</option>
                      <option value="Sugestão">Sugestão</option>
                      <option value="Elogio">Elogio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Órgão Manifestante</label>
                    <select
                      value={orgao}
                      onChange={(e) => setOrgao(e.target.value as TipoOrgao)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:border-amber-500 outline-none"
                    >
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Órgão Público">Órgão Público (Aciona Analista RI)</option>
                      <option value="Órgão Privado">Órgão Privado</option>
                      <option value="Anomalia">Anomalia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Tema da Campanha *</label>
                    <select
                      value={temaId}
                      onChange={(e) => {
                        const newTemaId = e.target.value;
                        setTemaId(newTemaId);
                        const primeirosSub = SUBTEMAS_VLI.filter((s) => s.temaId === newTemaId);
                        if (primeirosSub.length > 0) {
                          handleSubtemaChange(primeirosSub[0].id);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:border-amber-500 outline-none"
                    >
                      {TEMAS_VLI.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome} (ID {t.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Subtema *</label>
                    <select
                      value={subtemaId}
                      onChange={(e) => handleSubtemaChange(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:border-amber-500 outline-none"
                    >
                      {subtemasDoTema.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nome} (ID {s.id}) {s.exigeKmSb ? '[Exige KM]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Ativo VLI</label>
                    <select
                      value={ativo}
                      onChange={(e) => setAtivo(e.target.value as AtivoVLI)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:border-amber-500 outline-none"
                    >
                      <option value="Ferrovia">Ferrovia</option>
                      <option value="Porto">Porto</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Não se aplica">Não se aplica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Reincidência</label>
                    <select
                      value={reincidencia}
                      onChange={(e) => setReincidencia(e.target.value as ReincidenciaTipo)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:border-amber-500 outline-none font-semibold"
                    >
                      <option value="Primeiro contato">Primeiro contato</option>
                      <option value="Reincidência">Reincidência</option>
                    </select>
                  </div>
                </div>

                {/* Textos: Demanda e Resposta Final (max 1000 chars) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <label className="font-semibold text-slate-300">Texto da Demanda (Relato do Manifestante)</label>
                      <span className="font-mono text-[11px] text-slate-400">
                        {textoDemanda.length}/1000
                      </span>
                    </div>
                    <textarea
                      maxLength={1000}
                      rows={4}
                      value={textoDemanda}
                      onChange={(e) => setTextoDemanda(e.target.value)}
                      placeholder="Descreva de forma clara a manifestação relatada em linha..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-xs text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <label className="font-semibold text-slate-300">Resposta Final da Demanda</label>
                      <span className="font-mono text-[11px] text-slate-400">
                        {respostaFinal.length}/1000
                      </span>
                    </div>
                    <textarea
                      maxLength={1000}
                      rows={4}
                      value={respostaFinal}
                      onChange={(e) => setRespostaFinal(e.target.value)}
                      placeholder="Posicionamento conclusivo ou resposta técnica encaminhada ao manifestante..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-xs text-white placeholder-slate-400 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Encaminhamento, Conhecimento e Posicionamento (Regras VLI) */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-500" />
                    <span>4. Encaminhamento & Posicionamento Automático</span>
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    Regra VLI calcula o posicionamento conforme combinação
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Encaminhado? *</label>
                    <select
                      value={encaminhado}
                      onChange={(e) => handleEncaminhadoChange(e.target.value as EncaminhadoStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-semibold focus:border-amber-500 outline-none"
                    >
                      <option value="Sim">Sim (Encaminhar para a área)</option>
                      <option value="Não">Não (Tratado de imediato em linha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Conhecimento</label>
                    <select
                      value={conhecimento}
                      disabled={encaminhado === 'Não'}
                      onChange={(e) => handleConhecimentoChange(e.target.value as ConhecimentoStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:border-amber-500 outline-none disabled:opacity-50"
                    >
                      <option value="Não">Não (Exige resposta da área técnica)</option>
                      <option value="Sim">Sim (Apenas para conhecimento da área)</option>
                      <option value="Não se aplica">Não se aplica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Posicionamento (Status)</label>
                    <select
                      value={posicionamento}
                      onChange={(e) => setPosicionamento(e.target.value as PosicionamentoStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-bold focus:border-amber-500 outline-none"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em análise">Em análise</option>
                      <option value="Fechado">Fechado</option>
                    </select>
                  </div>
                </div>

                {/* Automation Rules Explanatory Pill */}
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    Posicionamento sugerido automaticamente: <strong className="text-amber-400 font-mono">{posicionamento}</strong>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {subtemaId === '105' || subtemaId === '401'
                      ? 'Subtema fecha automaticamente'
                      : subtemaId === '204'
                      ? 'Invasão vai para Em Análise'
                      : encaminhado === 'Não'
                      ? 'Encaminhado Não fecha'
                      : conhecimento === 'Sim'
                      ? 'Conhecimento Sim fecha'
                      : 'Encaminhado Sim sem conhecimento fica Pendente'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERAÇÕES */}
          {activeTab === 'interacoes' && (
            <div className="space-y-4">
              {/* New Interaction Input */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Registrar Nova Interação no Protocolo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tipo de Interação</label>
                    <select
                      value={tipoNovaInteracao}
                      onChange={(e) => setTipoNovaInteracao(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-white focus:border-amber-500 outline-none"
                    >
                      <option value="Registro do Operador">Registro do Operador</option>
                      <option value="Atendimento Telefônico">Atendimento Telefônico</option>
                      <option value="Retorno ao Cliente">Retorno ao Cliente</option>
                      <option value="Resposta da Área">Resposta da Área Técnica</option>
                      <option value="Cobrança SLA">Cobrança SLA</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-slate-400 mb-1">Detalhamento da Interação</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={novaInteracaoTexto}
                        onChange={(e) => setNovaInteracaoTexto(e.target.value)}
                        placeholder="Ex: Cidadão ligou cobrando status da demanda; informado prazo de 5 dias úteis..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:border-amber-500 outline-none"
                      />
                      <button
                        onClick={handleAddInteracao}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactions Timeline */}
              <div className="bg-slate-950/40 rounded-lg border border-slate-800 p-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Linha do Tempo de Interações ({interacoes.length})
                </h4>
                {interacoes.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Nenhuma interação registrada ainda neste protocolo.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {interacoes.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-900 rounded-md border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-amber-400">{item.tipo}</span>
                          <span className="font-mono">{formatarDataHora(item.dataHora)}</span>
                        </div>
                        <p className="text-slate-200">{item.descricao}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Registrado por: {item.usuario} ({item.perfil})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ANEXOS (LIMITE 25 MB) */}
          {activeTab === 'anexos' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Anexar Arquivo ao Protocolo (Fotos, Laudos, Ofícios)
                  </h4>
                  <div className={`text-xs font-mono px-2 py-0.5 rounded ${
                    totalAnexosMb > 25 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-slate-300'
                  }`}>
                    Capacidade: {totalAnexosMb.toFixed(1)} / 25.0 MB
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={simularAnexoNome}
                      onChange={(e) => setSimularAnexoNome(e.target.value)}
                      placeholder="Nome do arquivo (ex: foto_cruzamento_km412.jpg, laudo_ruido.pdf)"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={simularAnexoMb}
                      onChange={(e) => setSimularAnexoMb(parseFloat(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono"
                    >
                      <option value={1.2}>1.2 MB</option>
                      <option value={3.5}>3.5 MB</option>
                      <option value={8.0}>8.0 MB</option>
                      <option value={14.0}>14.0 MB</option>
                    </select>
                    <button
                      onClick={handleAddAnexo}
                      className="flex-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                    >
                      Anexar
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Regra VLI: Todos os anexos salvos no protocolo entram automaticamente no e-mail de encaminhamento com limite máximo consolidado de 25 MB.
                </div>
              </div>

              {/* Anexos list */}
              <div className="bg-slate-950/40 rounded-lg border border-slate-800 p-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Arquivos Vinculados ({anexos.length})
                </h4>
                {anexos.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Nenhum anexo adicionado a este protocolo.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {anexos.map((a) => (
                      <div key={a.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-amber-400" />
                          <span className="font-medium text-slate-200">{a.nome}</span>
                          <span className="font-mono text-slate-400">({a.tamanhoMb.toFixed(1)} MB)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {formatarDataSimples(a.dataUpload)}
                          </span>
                          <button
                            onClick={() => setAnexos(anexos.filter((x) => x.id !== a.id))}
                            className="text-rose-400 hover:underline text-[11px]"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ROTEAMENTO & E-MAIL (ITEM 5 DO PROCESSO) */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span>Disparo do E-mail de Encaminhamento VLI</span>
                  </h4>
                  {emailJaDisparado ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      E-mail Já Enviado
                    </span>
                  ) : condicaoDisparoEmailAtendida ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                      Pronto para Disparar no Salvamento
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Aguardando Condições de Disparo
                    </span>
                  )}
                </div>

                {/* 3 Conditions Checklist from VLI Process */}
                <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-300 mb-1">
                    Condições do processo VLI para envio do e-mail de encaminhamento:
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${!isNovoRegistro ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={!isNovoRegistro ? 'text-slate-200' : 'text-slate-400'}>
                      1. O registro já existe salvo (não é a tela de abertura rápida do protocolo).
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${encaminhado === 'Sim' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={encaminhado === 'Sim' ? 'text-slate-200' : 'text-slate-400'}>
                      2. Campo "Encaminhado" está marcado como "Sim".
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        !tipoInicialNoBanco ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <span
                      className={
                        !tipoInicialNoBanco ? 'text-slate-200' : 'text-slate-400'
                      }
                    >
                      3. O Tipo ainda estava vazio no banco de dados (evita reenvio em edições posteriores).
                    </span>
                  </div>
                </div>

                {/* Destinatários resolved */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-300">Destinatários Resolvidos:</span>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300 font-mono text-[11px] space-y-1">
                    <div>· Caixa Geral da Campanha: <strong>vli@comunicacontactcenter.com.br</strong></div>
                    {roteamento.destinatarioFixoEspecial && (
                      <div className="text-amber-300">
                        · Destinatário Fixo (Fora da Concessão): {roteamento.destinatarioFixoEspecial}
                      </div>
                    )}
                    {roteamento.analistas.map((a, idx) => (
                      <div key={idx}>· Analista da Cidade: {a}</div>
                    ))}
                    {roteamento.analistaRI && (
                      <div className="text-sky-300">· Analista RI (Órgão Público): {roteamento.analistaRI}</div>
                    )}
                    {roteamento.respondentes.map((r, idx) => (
                      <div key={idx}>· Respondente da Área ({r.area}): {r.nome} &lt;{r.email}&gt;</div>
                    ))}
                  </div>
                </div>

                {/* Subject & Preview */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-300">Assunto Oficial:</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 font-mono text-slate-100 text-[11px]">
                    {assuntoEmailCalculado}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-300">Conteúdo da Mensagem:</span>
                  <pre className="bg-slate-900 p-3 rounded border border-slate-800 font-mono text-slate-300 text-[11px] whitespace-pre-wrap">
                    {corpoEmailCalculado}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDITORIA / LOGS */}
          {activeTab === 'auditoria' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Trilha de Auditoria & Log de Alterações (Supervisão / TI / Coordenação)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Registro inviolável de auditoria sobre quem alterou campos de posicionamento, encaminhamento e dados da ficha.
                </p>

                {(!protocoloExistente?.logs || protocoloExistente.logs.length === 0) ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Nenhuma alteração registrada ainda. Os logs serão gravados ao salvar.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800 text-xs">
                    {protocoloExistente.logs.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{log.campo}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            De: <span className="font-mono text-slate-400">{log.valorAnterior}</span> → Para:{' '}
                            <span className="font-mono text-amber-300 font-semibold">{log.valorNovo}</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] font-mono text-slate-400">
                          <div>{log.usuario}</div>
                          <div>{formatarDataHora(log.dataHora)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Operador: <strong className="text-slate-200">{usuarioOperador}</strong></span>
            <span>·</span>
            <span className="font-mono">ComunicaContactCenter</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isNovoRegistro ? 'Registrar & Salvar Protocolo' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
