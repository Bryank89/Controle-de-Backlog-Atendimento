export type CanalEntrada = 'Alô VLI 0800' | 'Site fale conosco' | 'WhatsApp' | 'Atendimento em Libras';

export type TipoManifestacao =
  | 'Anomalia'
  | 'Denúncia'
  | 'Informação'
  | 'Reclamação'
  | 'Solicitação'
  | 'Sugestão'
  | 'Elogio';

export type TipoOrgao =
  | 'Anomalia'
  | 'Órgão Público'
  | 'Órgão Privado'
  | 'Pessoa Física';

export type AtivoVLI = 'Ferrovia' | 'Porto' | 'Terminal' | 'Não se aplica';

export type ReincidenciaTipo = 'Primeiro contato' | 'Reincidência';

export type EncaminhadoStatus = 'Sim' | 'Não';

export type ConhecimentoStatus = 'Sim' | 'Não' | 'Não se aplica';

export type PosicionamentoStatus = 'Pendente' | 'Em análise' | 'Fechado';

export type CorredorVLI =
  | 'Corredor Centro-Leste'
  | 'Corredor Centro-Sudeste'
  | 'Corredor Centro-Norte'
  | 'Corredor Minas-Rio'
  | 'Corredor Indefinido / Fora da Concessão';

export interface Manifestante {
  nome: string;
  email: string;
  celular: string;
  telefone: string;
  cpf: string;
}

export interface Localizacao {
  cidadeId: string;
  cidadeNome: string;
  uf: string;
  corredor: CorredorVLI;
  bairro: string;
  endereco: string;
  cep: string;
  pontoReferencia: string;
  km: string;
  sb: string; // Sub-trecho / Sub-bloco
}

export interface Classificacao {
  tipo: TipoManifestacao | '';
  orgao: TipoOrgao | '';
  temaId: string;
  temaNome: string;
  subtemaId: string;
  subtemaNome: string;
  ativo: AtivoVLI;
  reincidencia: ReincidenciaTipo;
  textoDemanda: string;
  respostaFinal: string;
}

export interface EncaminhamentoInfo {
  encaminhado: EncaminhadoStatus;
  conhecimento: ConhecimentoStatus;
  posicionamento: PosicionamentoStatus;
  emailEnviado: boolean;
  dataEnvioEmail?: string;
  emailsDestinatarios?: string[];
  assuntoEmail?: string;
  conteudoEmail?: string;
}

export interface InteracaoAtendimento {
  id: string;
  dataHora: string;
  usuario: string;
  perfil: string;
  tipo: 'Atendimento Telefônico' | 'Registro do Operador' | 'Cobrança SLA' | 'Resposta da Área' | 'Retorno ao Cliente';
  descricao: string;
}

export interface AnexoArquivo {
  id: string;
  nome: string;
  tamanhoMb: number;
  dataUpload: string;
  usuario: string;
  tipo: string;
}

export interface LogAuditoria {
  id: string;
  dataHora: string;
  usuario: string;
  campo: string;
  valorAnterior: string;
  valorNovo: string;
}

export interface CobrancaLog {
  id: string;
  dataHora: string;
  diaUtil: number;
  tipoAviso: string;
  destinatarios: string[];
  enviadoPor: 'Automático' | 'Operador' | 'Sistema';
  status: 'Enviado' | 'Marcado Manual' | 'Pendente';
}

export interface ProtocoloVLI {
  id: string;
  numeroProtocolo: string; // YYYYMMDDHHMM + 3 dígitos
  dataCriacao: string; // ISO string
  dataVencimento: string; // ISO string (5 dias úteis)
  dataFinalizacao?: string; // ISO string quando fechado
  usuarioAbertura: string;
  canal: CanalEntrada;
  manifestante: Manifestante;
  localizacao: Localizacao;
  classificacao: Classificacao;
  encaminhamento: EncaminhamentoInfo;
  interacoes: InteracaoAtendimento[];
  anexos: AnexoArquivo[];
  logs: LogAuditoria[];
  cobrancas: CobrancaLog[];
  // Calculated SLA fields
  diasUteisCorridos: number;
  statusSla: 'No prazo' | 'Prazo próximo' | 'Vence hoje' | 'Fora do prazo';
  avisoCobrançaEnviado: boolean;
}

export interface CidadeConfig {
  id: string;
  nome: string;
  uf: string;
  corredor: CorredorVLI;
  analistas: string[]; // até 4 analistas da cidade
  analistaRI: string; // analista de Relações Institucionais
  ativa: boolean;
}

export interface SubtemaConfig {
  id: string;
  nome: string;
  temaId: string;
  exigeKmSb: boolean;
  regraEspecialVegetacao?: boolean;
  posicionamentoPadrao?: PosicionamentoStatus;
  ativo: boolean;
}

export interface TemaConfig {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface RespondenteMailing {
  id: string;
  cidadeId?: string; // se undefined, "Válido para todas as cidades"
  temaId: string;
  subtemaId: string;
  nome: string;
  email: string;
  area: string;
}
