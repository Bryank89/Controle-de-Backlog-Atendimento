import {
  CidadeConfig,
  ProtocoloVLI,
  RespondenteMailing,
  SubtemaConfig,
  TemaConfig,
} from '../types';
import { adicionarDiasUteis, calcularDiasUteisCorridos, calcularStatusSLA } from '../utils/slaEngine';

export const CIDADES_VLI: CidadeConfig[] = [
  {
    id: 'cid-01',
    nome: 'Belo Horizonte',
    uf: 'MG',
    corredor: 'Corredor Centro-Leste',
    analistas: [
      'Renata Silva (renata.silva@vli-logistica.com.br)',
      'Carlos Eduardo Prado (carlos.prado@vli-logistica.com.br)',
      'Fernanda Meireles (fernanda.meireles@vli-logistica.com.br)',
      'Thiago Alcantara (thiago.alcantara@vli-logistica.com.br)',
    ],
    analistaRI: 'Mariana Duarte (mariana.duarte.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-02',
    nome: 'Divinópolis',
    uf: 'MG',
    corredor: 'Corredor Centro-Leste',
    analistas: [
      'Lucas Rezende (lucas.rezende@vli-logistica.com.br)',
      'Fernanda Meireles (fernanda.meireles@vli-logistica.com.br)',
    ],
    analistaRI: 'Mariana Duarte (mariana.duarte.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-03',
    nome: 'Vitória',
    uf: 'ES',
    corredor: 'Corredor Centro-Leste',
    analistas: [
      'Gabriel Fontana (gabriel.fontana@vli-logistica.com.br)',
      'Aline Vianna (aline.vianna@vli-logistica.com.br)',
    ],
    analistaRI: 'Rodrigo Bicalho (rodrigo.bicalho.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-04',
    nome: 'Santos',
    uf: 'SP',
    corredor: 'Corredor Centro-Sudeste',
    analistas: [
      'Marcelo Queiroz (marcelo.queiroz@vli-logistica.com.br)',
      'Camila Antunes (camila.antunes@vli-logistica.com.br)',
      'Bruno Nogueira (bruno.nogueira@vli-logistica.com.br)',
    ],
    analistaRI: 'Claudia Siqueira (claudia.siqueira.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-05',
    nome: 'Paulínia',
    uf: 'SP',
    corredor: 'Corredor Centro-Sudeste',
    analistas: [
      'Marcelo Queiroz (marcelo.queiroz@vli-logistica.com.br)',
      'Bruno Nogueira (bruno.nogueira@vli-logistica.com.br)',
    ],
    analistaRI: 'Claudia Siqueira (claudia.siqueira.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-06',
    nome: 'Araguari',
    uf: 'MG',
    corredor: 'Corredor Centro-Sudeste',
    analistas: [
      'Gustavo Martins (gustavo.martins@vli-logistica.com.br)',
      'Patrícia Faria (patricia.faria@vli-logistica.com.br)',
    ],
    analistaRI: 'Mariana Duarte (mariana.duarte.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-07',
    nome: 'Imperatriz',
    uf: 'MA',
    corredor: 'Corredor Centro-Norte',
    analistas: [
      'Valmir Nascimento (valmir.nascimento@vli-logistica.com.br)',
      'Juliana Brandão (juliana.brandao@vli-logistica.com.br)',
    ],
    analistaRI: 'Ernesto Vasconcelos (ernesto.vasconcelos.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-08',
    nome: 'São Luís',
    uf: 'MA',
    corredor: 'Corredor Centro-Norte',
    analistas: [
      'Valmir Nascimento (valmir.nascimento@vli-logistica.com.br)',
      'Kelly Cristine (kelly.cristine@vli-logistica.com.br)',
    ],
    analistaRI: 'Ernesto Vasconcelos (ernesto.vasconcelos.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-09',
    nome: 'Barra Mansa',
    uf: 'RJ',
    corredor: 'Corredor Minas-Rio',
    analistas: [
      'Leonardo Assis (leonardo.assis@vli-logistica.com.br)',
      'Beatriz Lopes (beatriz.lopes@vli-logistica.com.br)',
    ],
    analistaRI: 'Rodrigo Bicalho (rodrigo.bicalho.ri@vli-logistica.com.br)',
    ativa: true,
  },
  {
    id: 'cid-10',
    nome: 'Área Fora da Concessão / Trecho Indefinido',
    uf: 'BR',
    corredor: 'Corredor Indefinido / Fora da Concessão',
    analistas: ['João Lucas Macieira Ferreira (joao.ferreira@vli-logistica.com.br)'],
    analistaRI: 'João Lucas Macieira Ferreira (joao.ferreira@vli-logistica.com.br)',
    ativa: true,
  },
];

export const TEMAS_VLI: TemaConfig[] = [
  { id: '1', nome: 'Operação Ferroviária', ativo: true },
  { id: '2', nome: 'Faixa de Domínio & Infraestrutura', ativo: true },
  { id: '3', nome: 'Meio Ambiente & Comunidade', ativo: true },
  { id: '4', nome: 'Anomalias Operacionais & Incidentes', ativo: true },
  { id: '5', nome: 'Institucional & Atendimento ao Cliente', ativo: true },
];

export const SUBTEMAS_VLI: SubtemaConfig[] = [
  // Tema 1: Operação Ferroviária
  { id: '101', temaId: '1', nome: 'Buzina', exigeKmSb: true, ativo: true },
  { id: '102', temaId: '1', nome: 'Barulho de trem parado em operação', exigeKmSb: true, ativo: true },
  { id: '103', temaId: '1', nome: 'Velocidade da composição', exigeKmSb: false, ativo: true },
  { id: '104', temaId: '1', nome: 'Manobras no pátio', exigeKmSb: false, ativo: true },
  { id: '105', temaId: '1', nome: 'Acompanhamento de protocolo', exigeKmSb: false, posicionamentoPadrao: 'Fechado', ativo: true },

  // Tema 2: Faixa de Domínio & Infraestrutura
  { id: '201', temaId: '2', nome: 'Obstrução de passagens de nível e pontes', exigeKmSb: true, ativo: true },
  { id: '202', temaId: '2', nome: 'Vegetação alta', exigeKmSb: true, regraEspecialVegetacao: true, ativo: true },
  { id: '203', temaId: '2', nome: 'Lixo na faixa de domínio', exigeKmSb: true, ativo: true },
  { id: '204', temaId: '2', nome: 'Invasão de área', exigeKmSb: false, posicionamentoPadrao: 'Em análise', ativo: true },
  { id: '205', temaId: '2', nome: 'Cerca ou muro danificado', exigeKmSb: false, ativo: true },
  { id: '206', temaId: '2', nome: 'Passagem de nível clandestina', exigeKmSb: false, ativo: true },

  // Tema 3: Meio Ambiente & Comunidade
  { id: '301', temaId: '3', nome: 'Queimadas próximas à via', exigeKmSb: false, ativo: true },
  { id: '302', temaId: '3', nome: 'Poeira e emissão de particulados', exigeKmSb: false, ativo: true },
  { id: '303', temaId: '3', nome: 'Doação de dormentes / sucata', exigeKmSb: false, ativo: true },
  { id: '304', temaId: '3', nome: 'Visita institucional / Educação no trânsito', exigeKmSb: false, ativo: true },

  // Tema 4: Anomalias Operacionais & Incidentes
  { id: '401', temaId: '4', nome: 'Anomalia na via permanente', exigeKmSb: false, posicionamentoPadrao: 'Fechado', ativo: true },
  { id: '402', temaId: '4', nome: 'Abalroamento / Atropelamento', exigeKmSb: false, ativo: true },
  { id: '403', temaId: '4', nome: 'Descarrilamento', exigeKmSb: false, ativo: true },

  // Tema 5: Institucional
  { id: '501', temaId: '5', nome: 'Solicitação de patrocínio / Apoio social', exigeKmSb: false, ativo: true },
  { id: '502', temaId: '5', nome: 'Elogio à equipe operacional', exigeKmSb: false, ativo: true },
  { id: '503', temaId: '5', nome: 'Dúvidas sobre horários e cruzamentos', exigeKmSb: false, ativo: true },
];

export const MAILING_RESPONDENTES: RespondenteMailing[] = [
  // Respondentes específicos e gerais
  {
    id: 'resp-01',
    cidadeId: 'cid-01',
    temaId: '1',
    subtemaId: '101',
    nome: 'Eng. Mauro Santana',
    email: 'mauro.santana@vli-logistica.com.br',
    area: 'Engenharia de Operação Ferroviária - BH',
  },
  {
    id: 'resp-02',
    cidadeId: 'cid-01',
    temaId: '1',
    subtemaId: '102',
    nome: 'Supervisão de Pátio Barreiro',
    email: 'supervisao.barreiro@vli-logistica.com.br',
    area: 'Pátio Operacional Barreiro',
  },
  {
    id: 'resp-03',
    temaId: '2',
    subtemaId: '201',
    nome: 'Coordenação de Manutenção de Faixa',
    email: 'manutencao.faixa@vli-logistica.com.br',
    area: 'Infraestrutura Malha Sudeste/Leste',
  },
  {
    id: 'resp-04',
    temaId: '2',
    subtemaId: '202',
    nome: 'Equipe de Roçada e Meio Ambiente',
    email: 'rocada.faixa@vli-logistica.com.br',
    area: 'Gestão Ambiental & Conservação',
  },
  {
    id: 'resp-05',
    temaId: '2',
    subtemaId: '203',
    nome: 'Gestão de Resíduos e Faixa',
    email: 'residuos.operacao@vli-logistica.com.br',
    area: 'Segurança Patrimonial e SSMA',
  },
  {
    id: 'resp-06',
    temaId: '2',
    subtemaId: '204',
    nome: 'Jurídico e Patrimônio VLI',
    email: 'patrimonio.regularizacao@vli-logistica.com.br',
    area: 'Jurídico Fundiário',
  },
  {
    id: 'resp-07',
    cidadeId: 'cid-04',
    temaId: '1',
    subtemaId: '104',
    nome: 'Operações Terminal TIPLAM',
    email: 'operacoes.tiplam@vli-logistica.com.br',
    area: 'Terminal Integrador Portuário Luiz Antonio Mesquita',
  },
  {
    id: 'resp-08',
    temaId: '5',
    subtemaId: '502',
    nome: 'Comunicação Corporativa VLI',
    email: 'comunicacao@vli-logistica.com.br',
    area: 'Relações com a Comunidade',
  },
];

// Seeded Protocol Records
const hoje = new Date();

function gerarDataPassadaDiasUteis(diasAtras: number): { dataAbertura: Date; dataVencimento: Date } {
  const d = new Date(hoje.getTime());
  let subtraidos = 0;
  while (subtraidos < diasAtras) {
    d.setDate(d.getDate() - 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      subtraidos++;
    }
  }
  const vencimento = adicionarDiasUteis(d, 5);
  return { dataAbertura: d, dataVencimento: vencimento };
}

// Seed tickets
export function criarProtocolosIniciais(): ProtocoloVLI[] {
  // Ticket 1: Vence Hoje (D+5)
  const t1Datas = gerarDataPassadaDiasUteis(5);
  const diasT1 = calcularDiasUteisCorridos(t1Datas.dataAbertura.toISOString(), hoje);
  const slaT1 = calcularStatusSLA(diasT1, '201', 'Pendente');

  // Ticket 2: Prazo Próximo (D+3)
  const t2Datas = gerarDataPassadaDiasUteis(3);
  const diasT2 = calcularDiasUteisCorridos(t2Datas.dataAbertura.toISOString(), hoje);
  const slaT2 = calcularStatusSLA(diasT2, '102', 'Pendente');

  // Ticket 3: Fora do Prazo (D+8)
  const t3Datas = gerarDataPassadaDiasUteis(8);
  const diasT3 = calcularDiasUteisCorridos(t3Datas.dataAbertura.toISOString(), hoje);
  const slaT3 = calcularStatusSLA(diasT3, '203', 'Pendente');

  // Ticket 4: Vegetação Alta (D+5 especial)
  const t4Datas = gerarDataPassadaDiasUteis(5);
  const diasT4 = calcularDiasUteisCorridos(t4Datas.dataAbertura.toISOString(), hoje);
  const slaT4 = calcularStatusSLA(diasT4, '202', 'Em análise');

  // Ticket 5: No Prazo (D+1)
  const t5Datas = gerarDataPassadaDiasUteis(1);
  const diasT5 = calcularDiasUteisCorridos(t5Datas.dataAbertura.toISOString(), hoje);
  const slaT5 = calcularStatusSLA(diasT5, '101', 'Pendente');

  // Ticket 6: Corredor Indefinido (João Lucas)
  const t6Datas = gerarDataPassadaDiasUteis(2);
  const diasT6 = calcularDiasUteisCorridos(t6Datas.dataAbertura.toISOString(), hoje);
  const slaT6 = calcularStatusSLA(diasT6, '301', 'Pendente');

  // Ticket 7: Fechado (Acompanhamento de protocolo)
  const t7Datas = gerarDataPassadaDiasUteis(4);
  const diasT7 = calcularDiasUteisCorridos(t7Datas.dataAbertura.toISOString(), hoje);
  const slaT7 = calcularStatusSLA(diasT7, '105', 'Fechado');

  // Ticket 8: Em análise (Invasão de área)
  const t8Datas = gerarDataPassadaDiasUteis(7);
  const diasT8 = calcularDiasUteisCorridos(t8Datas.dataAbertura.toISOString(), hoje);
  const slaT8 = calcularStatusSLA(diasT8, '204', 'Em análise');

  return [
    {
      id: 'proto-1001',
      numeroProtocolo: '202610100915234',
      dataCriacao: t1Datas.dataAbertura.toISOString(),
      dataVencimento: t1Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.mariana (ComunicaContactCenter)',
      canal: 'Alô VLI 0800',
      manifestante: {
        nome: 'Antônio Carlos de Albuquerque',
        email: 'antonio.albuquerque@gmail.com',
        celular: '(13) 98124-7744',
        telefone: '(13) 3221-5080',
        cpf: '128.455.908-11',
      },
      localizacao: {
        cidadeId: 'cid-04',
        cidadeNome: 'Santos',
        uf: 'SP',
        corredor: 'Corredor Centro-Sudeste',
        bairro: 'Porto Alemoa',
        endereco: 'Avenida Engenheiro Augusto Barata, s/n',
        cep: '11095-650',
        pontoReferencia: 'Próximo ao Viaduto de Acesso Marginal',
        km: '084+200',
        sb: 'SB-04 Santos',
      },
      classificacao: {
        tipo: 'Reclamação',
        orgao: 'Pessoa Física',
        temaId: '2',
        temaNome: 'Faixa de Domínio & Infraestrutura',
        subtemaId: '201',
        subtemaNome: 'Obstrução de passagens de nível e pontes',
        ativo: 'Porto',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'Morador relata que a composição ferroviária ficou parada trancando a passagem de nível principal de acesso ao bairro por mais de 45 minutos no horário de pico matinal, impedindo passagem de ambulância e ônibus urbanos.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Pendente',
        emailEnviado: true,
        dataEnvioEmail: t1Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'marcelo.queiroz@vli-logistica.com.br',
          'camila.antunes@vli-logistica.com.br',
          'manutencao.faixa@vli-logistica.com.br',
        ],
        assuntoEmail:
          '[Reclamação] Alô VLI - Faixa de Domínio & Infraestrutura - Protocolo 202610100915234',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda: Morador relata obstrução de PN em Santos / SP.',
      },
      interacoes: [
        {
          id: 'int-01',
          dataHora: t1Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          perfil: 'Operador Alô VLI',
          tipo: 'Registro do Operador',
          descricao: 'Protocolo registrado em chamada telefônica. Encaminhado para a equipe de Santos.',
        },
      ],
      anexos: [
        {
          id: 'anx-01',
          nome: 'foto_bloqueio_pn_alemoa.jpg',
          tamanhoMb: 3.4,
          dataUpload: t1Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          tipo: 'image/jpeg',
        },
      ],
      logs: [
        {
          id: 'log-01',
          dataHora: t1Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          campo: 'Status Inicial',
          valorAnterior: '-',
          valorNovo: 'Pendente (Encaminhado com e-mail)',
        },
      ],
      cobrancas: [
        {
          id: 'cob-01',
          dataHora: t1Datas.dataAbertura.toISOString(),
          diaUtil: 3,
          tipoAviso: 'Prazo próximo do vencimento',
          destinatarios: ['marcelo.queiroz@vli-logistica.com.br'],
          enviadoPor: 'Automático',
          status: 'Enviado',
        },
      ],
      diasUteisCorridos: diasT1,
      statusSla: slaT1.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1002',
      numeroProtocolo: '202610121420789',
      dataCriacao: t2Datas.dataAbertura.toISOString(),
      dataVencimento: t2Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.felipe (ComunicaContactCenter)',
      canal: 'Alô VLI 0800',
      manifestante: {
        nome: 'Maria de Lourdes Fontoura',
        email: 'lourdes.fontoura@uol.com.br',
        celular: '(31) 99312-0044',
        telefone: '(31) 3384-2190',
        cpf: '334.891.206-88',
      },
      localizacao: {
        cidadeId: 'cid-01',
        cidadeNome: 'Belo Horizonte',
        uf: 'MG',
        corredor: 'Corredor Centro-Leste',
        bairro: 'Barreiro de Cima',
        endereco: 'Rua José Gonçalves, 410',
        cep: '30640-180',
        pontoReferencia: 'Fundos da linha férrea atrás da paróquia',
        km: '412+350',
        sb: 'SB-01 Barreiro',
      },
      classificacao: {
        tipo: 'Reclamação',
        orgao: 'Pessoa Física',
        temaId: '1',
        temaNome: 'Operação Ferroviária',
        subtemaId: '102',
        subtemaNome: 'Barulho de trem parado em operação',
        ativo: 'Ferrovia',
        reincidencia: 'Reincidência',
        textoDemanda:
          'Manifestante informa que locomotivas a diesel permanecem com motores ligados em marcha lenta por madrugadas inteiras no trecho do Barreiro, gerando ruído de baixa frequência que vibra janelas das residências.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Pendente',
        emailEnviado: true,
        dataEnvioEmail: t2Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'renata.silva@vli-logistica.com.br',
          'carlos.prado@vli-logistica.com.br',
          'supervisao.barreiro@vli-logistica.com.br',
        ],
        assuntoEmail:
          '[Reclamação] Alô VLI - Operação Ferroviária - Protocolo 202610121420789',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda: Barulho excessivo de locomotivas em marcha lenta no Barreiro.',
      },
      interacoes: [
        {
          id: 'int-02',
          dataHora: t2Datas.dataAbertura.toISOString(),
          usuario: 'operador.felipe',
          perfil: 'Operador Alô VLI',
          tipo: 'Registro do Operador',
          descricao: 'Atendimento via 0800 registrado. Cliente informou reincidência de contatos anteriores.',
        },
      ],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT2,
      statusSla: slaT2.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1003',
      numeroProtocolo: '202610051130451',
      dataCriacao: t3Datas.dataAbertura.toISOString(),
      dataVencimento: t3Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.mariana (ComunicaContactCenter)',
      canal: 'WhatsApp',
      manifestante: {
        nome: 'Prefeitura Municipal de Araguari - Secretaria de Obras',
        email: 'ouvidoria.obras@araguari.mg.gov.br',
        celular: '(34) 99881-2233',
        telefone: '(34) 3690-3000',
        cpf: '01.234.567/0001-99',
      },
      localizacao: {
        cidadeId: 'cid-06',
        cidadeNome: 'Araguari',
        uf: 'MG',
        corredor: 'Corredor Centro-Sudeste',
        bairro: 'Goiás Parte Alta',
        endereco: 'Avenida Belchior de Godoy, próximo ao Viaduto',
        cep: '38442-198',
        pontoReferencia: 'Ao lado da estação ferroviária desativada',
        km: '028+600',
        sb: 'SB-02 Araguari',
      },
      classificacao: {
        tipo: 'Solicitação',
        orgao: 'Órgão Público',
        temaId: '2',
        temaNome: 'Faixa de Domínio & Infraestrutura',
        subtemaId: '203',
        subtemaNome: 'Lixo na faixa de domínio',
        ativo: 'Ferrovia',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'A Secretaria de Obras solicita mutirão de limpeza e remoção de entulho depositado irregularmente na faixa de domínio contígua ao viaduto, com risco de criadouro de mosquitos e focos de dengue.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Pendente',
        emailEnviado: true,
        dataEnvioEmail: t3Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'gustavo.martins@vli-logistica.com.br',
          'patricia.faria@vli-logistica.com.br',
          'mariana.duarte.ri@vli-logistica.com.br', // Analista RI entra por ser Órgão Público!
          'residuos.operacao@vli-logistica.com.br',
        ],
        assuntoEmail:
          '[Solicitação] Alô VLI - Faixa de Domínio & Infraestrutura - Protocolo 202610051130451',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda: Órgão público solicita limpeza de resíduos.',
      },
      interacoes: [
        {
          id: 'int-03a',
          dataHora: t3Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          perfil: 'Operador Alô VLI',
          tipo: 'Registro do Operador',
          descricao: 'Protocolo gerado a partir de mensagem oficial de WhatsApp da Prefeitura.',
        },
        {
          id: 'int-03b',
          dataHora: hoje.toISOString(),
          usuario: 'sistema',
          perfil: 'Robô SLA',
          tipo: 'Cobrança SLA',
          descricao: 'Alerta D+7 / D+8 disparado: prazo ultrapassado sem posicionamento da equipe técnica.',
        },
      ],
      anexos: [
        {
          id: 'anx-03',
          nome: 'oficio_prefeitura_araguari_048.pdf',
          tamanhoMb: 1.8,
          dataUpload: t3Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          tipo: 'application/pdf',
        },
      ],
      logs: [],
      cobrancas: [
        {
          id: 'cob-03a',
          dataHora: t3Datas.dataAbertura.toISOString(),
          diaUtil: 3,
          tipoAviso: 'Prazo próximo do vencimento',
          destinatarios: ['gustavo.martins@vli-logistica.com.br'],
          enviadoPor: 'Automático',
          status: 'Enviado',
        },
        {
          id: 'cob-03b',
          dataHora: t3Datas.dataAbertura.toISOString(),
          diaUtil: 5,
          tipoAviso: 'Protocolo vence hoje',
          destinatarios: ['gustavo.martins@vli-logistica.com.br', 'mariana.duarte.ri@vli-logistica.com.br'],
          enviadoPor: 'Automático',
          status: 'Enviado',
        },
        {
          id: 'cob-03c',
          dataHora: hoje.toISOString(),
          diaUtil: 7,
          tipoAviso: 'Fora do prazo (Cobrança Crítica)',
          destinatarios: ['gustavo.martins@vli-logistica.com.br', 'patricia.faria@vli-logistica.com.br'],
          enviadoPor: 'Automático',
          status: 'Pendente',
        },
      ],
      diasUteisCorridos: diasT3,
      statusSla: slaT3.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1004',
      numeroProtocolo: '202610101645992',
      dataCriacao: t4Datas.dataAbertura.toISOString(),
      dataVencimento: t4Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.ana (ComunicaContactCenter)',
      canal: 'Site fale conosco',
      manifestante: {
        nome: 'Julio Cesar Peçanha',
        email: 'julio.pecanha.agro@gmail.com',
        celular: '(37) 99105-8822',
        telefone: '',
        cpf: '741.025.336-40',
      },
      localizacao: {
        cidadeId: 'cid-02',
        cidadeNome: 'Divinópolis',
        uf: 'MG',
        corredor: 'Corredor Centro-Leste',
        bairro: 'Porto Velho',
        endereco: 'Rua Amazonas, próximo ao cruzamento ferroviário',
        cep: '35500-025',
        pontoReferencia: 'Trilhos paralelos ao Rio Itapecerica',
        km: '115+800',
        sb: 'SB-03 Divinópolis',
      },
      classificacao: {
        tipo: 'Solicitação',
        orgao: 'Pessoa Física',
        temaId: '2',
        temaNome: 'Faixa de Domínio & Infraestrutura',
        subtemaId: '202', // Vegetação Alta (regra especial!)
        subtemaNome: 'Vegetação alta',
        ativo: 'Ferrovia',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'Mato alto e capim crescendo desordenadamente junto à passagem em nível, prejudicando a visibilidade de motoristas e pedestres que atravessam os trilhos.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Em análise', // Vegetação alta vai para Em análise no D+5
        emailEnviado: true,
        dataEnvioEmail: t4Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'lucas.rezende@vli-logistica.com.br',
          'rocada.faixa@vli-logistica.com.br',
        ],
        assuntoEmail:
          '[Solicitação] Alô VLI - Faixa de Domínio & Infraestrutura - Protocolo 202610101645992',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda: Roçada de vegetação alta em Divinópolis.',
      },
      interacoes: [
        {
          id: 'int-04',
          dataHora: hoje.toISOString(),
          usuario: 'sistema',
          perfil: 'Robô SLA',
          tipo: 'Cobrança SLA',
          descricao:
            'Subtema Vegetação Alta: D+5 atingido. Posicionamento transferido automaticamente para "Em análise". E-mail de atualização disparado ao manifestante.',
        },
      ],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT4,
      statusSla: slaT4.status,
      avisoCobrançaEnviado: true,
    },
    {
      id: 'proto-1005',
      numeroProtocolo: '202610141010612',
      dataCriacao: t5Datas.dataAbertura.toISOString(),
      dataVencimento: t5Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.mariana (ComunicaContactCenter)',
      canal: 'Alô VLI 0800',
      manifestante: {
        nome: 'Simone Aparecida Mendes',
        email: 'simonemendes.adv@terra.com.br',
        celular: '(19) 99742-1188',
        telefone: '(19) 3874-5500',
        cpf: '215.632.888-04',
      },
      localizacao: {
        cidadeId: 'cid-05',
        cidadeNome: 'Paulínia',
        uf: 'SP',
        corredor: 'Corredor Centro-Sudeste',
        bairro: 'Betel',
        endereco: 'Estrada Municipal PLN-346, KM 4',
        cep: '13148-120',
        pontoReferencia: 'Próximo à refinaria e duto',
        km: '042+150',
        sb: 'SB-08 Paulínia',
      },
      classificacao: {
        tipo: 'Reclamação',
        orgao: 'Pessoa Física',
        temaId: '1',
        temaNome: 'Operação Ferroviária',
        subtemaId: '101',
        subtemaNome: 'Buzina',
        ativo: 'Ferrovia',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'Moradora questiona o acionamento excessivo da buzina ferroviária durante a madrugada (entre 02h e 04h) sem travessia aparente no cruzamento de Betel.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Pendente',
        emailEnviado: true,
        dataEnvioEmail: t5Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'marcelo.queiroz@vli-logistica.com.br',
          'bruno.nogueira@vli-logistica.com.br',
          'mauro.santana@vli-logistica.com.br',
        ],
        assuntoEmail: '[Reclamação] Alô VLI - Operação Ferroviária - Protocolo 202610141010612',
        conteudoEmail: 'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.',
      },
      interacoes: [],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT5,
      statusSla: slaT5.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1006',
      numeroProtocolo: '202610130845331',
      dataCriacao: t6Datas.dataAbertura.toISOString(),
      dataVencimento: t6Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.felipe (ComunicaContactCenter)',
      canal: 'Alô VLI 0800',
      manifestante: {
        nome: 'Cláudio Humberto Resende',
        email: 'claudio.resende@gmail.com',
        celular: '(31) 98822-1100',
        telefone: '',
        cpf: '098.765.432-10',
      },
      localizacao: {
        cidadeId: 'cid-10',
        cidadeNome: 'Área Fora da Concessão / Trecho Indefinido',
        uf: 'BR',
        corredor: 'Corredor Indefinido / Fora da Concessão',
        bairro: 'Zona Rural Rodovia',
        endereco: 'BR-040 KM 680',
        cep: '36200-000',
        pontoReferencia: 'Trecho compartilhado de entroncamento',
        km: '000+000',
        sb: 'SB-00 Indefinido',
      },
      classificacao: {
        tipo: 'Denúncia',
        orgao: 'Pessoa Física',
        temaId: '3',
        temaNome: 'Meio Ambiente & Comunidade',
        subtemaId: '301',
        subtemaNome: 'Queimadas próximas à via',
        ativo: 'Ferrovia',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'Foco de incêndio às margens da ferrovia em trecho fora da concessão principal, fumaça invadindo pista e cabines de sinalização.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Pendente',
        emailEnviado: true,
        dataEnvioEmail: t6Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'joao.ferreira@vli-logistica.com.br', // Destinatário fixo João Lucas Macieira Ferreira!
        ],
        assuntoEmail: '[Denúncia] Alô VLI - Meio Ambiente & Comunidade - Protocolo 202610130845331',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda em área fora da concessão direcionada ao analista João Lucas.',
      },
      interacoes: [],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT6,
      statusSla: slaT6.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1007',
      numeroProtocolo: '202610111530119',
      dataCriacao: t7Datas.dataAbertura.toISOString(),
      dataVencimento: t7Datas.dataVencimento.toISOString(),
      dataFinalizacao: hoje.toISOString(),
      usuarioAbertura: 'operador.mariana (ComunicaContactCenter)',
      canal: 'Atendimento em Libras',
      manifestante: {
        nome: 'Beatriz Vasconcelos de Souza',
        email: 'beatriz.vasc@hotmail.com',
        celular: '(31) 99120-4499',
        telefone: '',
        cpf: '556.778.990-21',
      },
      localizacao: {
        cidadeId: 'cid-01',
        cidadeNome: 'Belo Horizonte',
        uf: 'MG',
        corredor: 'Corredor Centro-Leste',
        bairro: 'Horto Florestal',
        endereco: 'Rua Gustavo da Silveira, 800',
        cep: '31030-010',
        pontoReferencia: 'Próximo à Estação Horto do Metrô',
        km: '',
        sb: '',
      },
      classificacao: {
        tipo: 'Informação',
        orgao: 'Pessoa Física',
        temaId: '1',
        temaNome: 'Operação Ferroviária',
        subtemaId: '105', // Acompanhamento de protocolo (Auto-fechado)
        subtemaNome: 'Acompanhamento de protocolo',
        ativo: 'Ferrovia',
        reincidencia: 'Reincidência',
        textoDemanda:
          'Manifestante solicitou posição e leitura do laudo técnico emitido no protocolo anterior sobre passagem de pedestres no Horto.',
        respostaFinal:
          'Informado à cidadã que as intervenções de fechamento e segurança foram concluídas em 08/10 conforme relatório de engenharia.',
      },
      encaminhamento: {
        encaminhado: 'Não',
        conhecimento: 'Não se aplica',
        posicionamento: 'Fechado', // Auto-fechado
        emailEnviado: false,
      },
      interacoes: [
        {
          id: 'int-07',
          dataHora: t7Datas.dataAbertura.toISOString(),
          usuario: 'operador.mariana',
          perfil: 'Operador Alô VLI',
          tipo: 'Atendimento Telefônico',
          descricao: 'Atendimento realizado via chamada em vídeo com intérprete de Libras. Dúvida sanada de imediato.',
        },
      ],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT7,
      statusSla: slaT7.status,
      avisoCobrançaEnviado: false,
    },
    {
      id: 'proto-1008',
      numeroProtocolo: '202610061700943',
      dataCriacao: t8Datas.dataAbertura.toISOString(),
      dataVencimento: t8Datas.dataVencimento.toISOString(),
      usuarioAbertura: 'operador.felipe (ComunicaContactCenter)',
      canal: 'Alô VLI 0800',
      manifestante: {
        nome: 'Geraldo Ferreira Neto',
        email: 'geraldo.ferreira.neto@gmail.com',
        celular: '(99) 98455-1234',
        telefone: '(99) 3524-1100',
        cpf: '456.123.789-00',
      },
      localizacao: {
        cidadeId: 'cid-07',
        cidadeNome: 'Imperatriz',
        uf: 'MA',
        corredor: 'Corredor Centro-Norte',
        bairro: 'Entroncamento',
        endereco: 'Rua Hermes da Fonseca, lote 12',
        cep: '65913-050',
        pontoReferencia: 'Próximo ao muro perimetral da ferrovia',
        km: '',
        sb: '',
      },
      classificacao: {
        tipo: 'Denúncia',
        orgao: 'Pessoa Física',
        temaId: '2',
        temaNome: 'Faixa de Domínio & Infraestrutura',
        subtemaId: '204', // Invasão de área (Auto Em análise)
        subtemaNome: 'Invasão de área',
        ativo: 'Ferrovia',
        reincidencia: 'Primeiro contato',
        textoDemanda:
          'Construção de barracão de alvenaria e cerca irregular avançando sobre a faixa de domínio a menos de 5 metros dos trilhos da FNS.',
        respostaFinal: '',
      },
      encaminhamento: {
        encaminhado: 'Sim',
        conhecimento: 'Não',
        posicionamento: 'Em análise',
        emailEnviado: true,
        dataEnvioEmail: t8Datas.dataAbertura.toISOString(),
        emailsDestinatarios: [
          'vli@comunicacontactcenter.com.br',
          'valmir.nascimento@vli-logistica.com.br',
          'patrimonio.regularizacao@vli-logistica.com.br',
        ],
        assuntoEmail:
          '[Denúncia] Alô VLI - Faixa de Domínio & Infraestrutura - Protocolo 202610061700943',
        conteudoEmail:
          'Pede apoio para elaborar a resposta, com prazo de 5 dias úteis.\n\nDemanda de invasão de área encaminhada para análise fundiária e patrimonial.',
      },
      interacoes: [],
      anexos: [],
      logs: [],
      cobrancas: [],
      diasUteisCorridos: diasT8,
      statusSla: slaT8.status,
      avisoCobrançaEnviado: false,
    },
  ];
}
