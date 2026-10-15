import {
  CidadeConfig,
  CorredorVLI,
  PosicionamentoStatus,
  RespondenteMailing,
  SubtemaConfig,
  TipoOrgao,
} from '../types';

// VLI and National holidays (dates in format MM-DD)
const FERIADOS_FIXOS = [
  '01-01', // Confraternização Universal
  '04-21', // Tiradentes
  '05-01', // Dia do Trabalho
  '09-07', // Independência do Brasil
  '10-12', // Nossa Senhora Aparecida
  '11-02', // Finados
  '11-15', // Proclamação da República
  '11-20', // Dia da Consciência Negra
  '12-25', // Natal
];

/**
 * Checks if a given date is a weekend or holiday
 */
export function isDiaUtil(data: Date): boolean {
  const diaSemana = data.getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    return false; // Domingo (0) ou Sábado (6)
  }

  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const dd = String(data.getDate()).padStart(2, '0');
  const mmdd = `${mm}-${dd}`;

  if (FERIADOS_FIXOS.includes(mmdd)) {
    return false;
  }

  return true;
}

/**
 * Calculates deadline adding N business days (5 dias úteis padrão da VLI)
 */
export function adicionarDiasUteis(dataInicial: Date, diasUteisNecessarios: number = 5): Date {
  const data = new Date(dataInicial.getTime());
  let diasAdicionados = 0;

  while (diasAdicionados < diasUteisNecessarios) {
    data.setDate(data.getDate() + 1);
    if (isDiaUtil(data)) {
      diasAdicionados++;
    }
  }

  return data;
}

/**
 * Computes business days elapsed between two dates
 */
export function calcularDiasUteisCorridos(dataInicioStr: string, dataFim: Date = new Date()): number {
  const inicio = new Date(dataInicioStr);
  let atual = new Date(inicio.getTime());
  
  // Set to start of day for comparison
  atual.setHours(0, 0, 0, 0);
  const fim = new Date(dataFim.getTime());
  fim.setHours(0, 0, 0, 0);

  if (atual >= fim) return 0;

  let contagem = 0;
  while (atual < fim) {
    atual.setDate(atual.getDate() + 1);
    if (isDiaUtil(atual)) {
      contagem++;
    }
  }

  return contagem;
}

/**
 * Formats a Date to ISO Brazilian standard DD/MM/YYYY HH:mm
 */
export function formatarDataHora(dataIsoStr: string): string {
  try {
    const d = new Date(dataIsoStr);
    if (isNaN(d.getTime())) return dataIsoStr;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  } catch {
    return dataIsoStr;
  }
}

export function formatarDataSimples(dataIsoStr: string): string {
  try {
    const d = new Date(dataIsoStr);
    if (isNaN(d.getTime())) return dataIsoStr;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch {
    return dataIsoStr;
  }
}

/**
 * Generates Protocol string: YYYYMMDDHHMM + 3 random digits
 * Example: 202610150845812
 */
export function gerarNumeroProtocolo(data: Date = new Date()): string {
  const yyyy = data.getFullYear();
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const dd = String(data.getDate()).padStart(2, '0');
  const hh = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  const tresDigitos = Math.floor(100 + Math.random() * 900); // 100 to 999
  return `${yyyy}${mm}${dd}${hh}${min}${tresDigitos}`;
}

/**
 * Automatic SLA status calculator based on VLI process documentation
 */
export function calcularStatusSLA(
  diasUteisCorridos: number,
  subtemaId: string,
  posicionamento: PosicionamentoStatus
): {
  status: 'No prazo' | 'Prazo próximo' | 'Vence hoje' | 'Fora do prazo';
  avisoRecomendado: string;
  badgeCor: string;
} {
  if (posicionamento === 'Fechado') {
    return {
      status: 'No prazo',
      avisoRecomendado: 'Finalizado',
      badgeCor: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60',
    };
  }

  // Regra especial de Vegetação Alta (subtemaId: '202')
  const isVegetacaoAlta = subtemaId === '202';

  if (isVegetacaoAlta) {
    if (diasUteisCorridos < 3) {
      return {
        status: 'No prazo',
        avisoRecomendado: 'D+0: Pedido de apoio (5 dias úteis)',
        badgeCor: 'text-slate-300 bg-slate-800/80 border border-slate-700',
      };
    }
    if (diasUteisCorridos === 3 || diasUteisCorridos === 4) {
      return {
        status: 'Prazo próximo',
        avisoRecomendado: 'D+3: Prazo próximo do vencimento',
        badgeCor: 'text-amber-300 bg-amber-950/70 border border-amber-800/70',
      };
    }
    if (diasUteisCorridos === 5) {
      return {
        status: 'Vence hoje',
        avisoRecomendado: 'D+5: Notificar manifestante e transferir p/ Em análise',
        badgeCor: 'text-orange-300 bg-orange-950/70 border border-orange-800/70',
      };
    }
    if (diasUteisCorridos >= 6) {
      const marco = [10, 20, 30, 40, 53].find((d) => d === diasUteisCorridos) || diasUteisCorridos;
      return {
        status: 'Fora do prazo',
        avisoRecomendado: `D+${marco}: Fora do prazo (Em análise)`,
        badgeCor: 'text-rose-300 bg-rose-950/70 border border-rose-800/70',
      };
    }
  }

  // Fluxo padrão da VLI
  if (diasUteisCorridos < 3) {
    return {
      status: 'No prazo',
      avisoRecomendado: 'No prazo regular (até 5 dias úteis)',
      badgeCor: 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/60',
    };
  }
  if (diasUteisCorridos === 3 || diasUteisCorridos === 4) {
    return {
      status: 'Prazo próximo',
      avisoRecomendado: 'D+3: Prazo próximo do vencimento',
      badgeCor: 'text-amber-300 bg-amber-950/70 border border-amber-800/70',
    };
  }
  if (diasUteisCorridos === 5) {
    return {
      status: 'Vence hoje',
      avisoRecomendado: 'D+5: Protocolo vence hoje!',
      badgeCor: 'text-orange-300 bg-orange-950/70 border border-orange-800/70',
    };
  }
  // 6 ou mais dias úteis
  const marcoPadrao = [7, 10, 20, 30].find((m) => diasUteisCorridos >= m) || diasUteisCorridos;
  return {
    status: 'Fora do prazo',
    avisoRecomendado: `D+${marcoPadrao}: Fora do prazo (Cobrança SLA)`,
    badgeCor: 'text-rose-300 bg-rose-950/70 border border-rose-800/70',
  };
}

/**
 * Resolves automatic Posicionamento as defined in VLI Campanha document:
 * - Subtema acompanhamento de protocolo (105) ou anomalia (401): Fechado
 * - Subtema invasão de área (204): Em análise
 * - Encaminhado Não: Fechado
 * - Encaminhado Sim e Conhecimento Sim: Fechado
 * - Encaminhado Sim e Conhecimento Não: Pendente
 */
export function sugerirPosicionamento(
  subtemaId: string,
  encaminhado: 'Sim' | 'Não',
  conhecimento: 'Sim' | 'Não' | 'Não se aplica'
): PosicionamentoStatus {
  if (subtemaId === '105' || subtemaId === '401') {
    return 'Fechado';
  }
  if (subtemaId === '204') {
    return 'Em análise';
  }
  if (encaminhado === 'Não') {
    return 'Fechado';
  }
  if (encaminhado === 'Sim') {
    if (conhecimento === 'Sim') {
      return 'Fechado';
    }
    return 'Pendente';
  }
  return 'Pendente';
}

/**
 * Checks if KM and SB are mandatory for a given subtema:
 * - Buzina (101)
 * - Barulho de trem parado em operação (102)
 * - Obstrução de passagens de nível e pontes (201)
 * - Vegetação alta (202)
 * - Lixo na faixa de domínio (203)
 */
export function subtemaExigeKmSb(subtemaId: string): boolean {
  return ['101', '102', '201', '202', '203'].includes(subtemaId);
}

/**
 * Resolves routing email recipients based on:
 * - Cidade -> Analistas (até 4) + Analista RI (se órgão público)
 * - Corredor Indefinido / Fora da concessão -> Analista fixo João Lucas Macieira Ferreira
 * - Respondentes da matriz de mailing (Cidade + Tema + Subtema ou Geral)
 * - Caixa da campanha: vli@comunicacontactcenter.com.br
 */
export function resolverDestinatariosEncaminhamento(
  cidade: CidadeConfig | undefined,
  corredor: CorredorVLI,
  orgao: TipoOrgao | '',
  temaId: string,
  subtemaId: string,
  respondentesBase: RespondenteMailing[]
): {
  analistas: string[];
  analistaRI?: string;
  respondentes: { nome: string; email: string; area: string }[];
  emailsFinais: string[];
  destinatarioFixoEspecial?: string;
} {
  const emails = new Set<string>();
  const emailContactCenter = 'vli@comunicacontactcenter.com.br';
  emails.add(emailContactCenter);

  const isForaConcessao = corredor === 'Corredor Indefinido / Fora da Concessão';

  let analistasLista: string[] = [];
  let analistaRI: string | undefined = undefined;
  let destinatarioFixo: string | undefined = undefined;

  if (isForaConcessao) {
    destinatarioFixo = 'João Lucas Macieira Ferreira (joao.ferreira@vli-logistica.com.br)';
    emails.add('joao.ferreira@vli-logistica.com.br');
  } else if (cidade) {
    analistasLista = [...(cidade.analistas || [])];
    cidade.analistas.forEach((a) => {
      // Extract email from "Nome (email@vli-logistica.com.br)" or raw email
      const match = a.match(/\((.*?)\)/);
      if (match) {
        emails.add(match[1]);
      } else if (a.includes('@')) {
        emails.add(a);
      }
    });

    if (orgao === 'Órgão Público' && cidade.analistaRI) {
      analistaRI = cidade.analistaRI;
      const matchRI = cidade.analistaRI.match(/\((.*?)\)/);
      if (matchRI) {
        emails.add(matchRI[1]);
      } else if (cidade.analistaRI.includes('@')) {
        emails.add(cidade.analistaRI);
      }
    }
  }

  // Filter respondentes (first check specific city, else fallback to valid for all)
  const respondentesEspecificos = respondentesBase.filter(
    (r) => r.cidadeId === cidade?.id && r.temaId === temaId && r.subtemaId === subtemaId
  );

  let respondentesFiltrados: RespondenteMailing[] = [];
  if (respondentesEspecificos.length > 0) {
    respondentesFiltrados = respondentesEspecificos.slice(0, 4);
  } else {
    respondentesFiltrados = respondentesBase
      .filter((r) => !r.cidadeId && r.temaId === temaId && r.subtemaId === subtemaId)
      .slice(0, 4);
  }

  respondentesFiltrados.forEach((r) => {
    emails.add(r.email);
  });

  return {
    analistas: analistasLista,
    analistaRI,
    destinatarioFixoEspecial: destinatarioFixo,
    respondentes: respondentesFiltrados.map((r) => ({
      nome: r.nome,
      email: r.email,
      area: r.area,
    })),
    emailsFinais: Array.from(emails),
  };
}
