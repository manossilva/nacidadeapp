/**
 * Dados de EXEMPLO — aparecem enquanto o banco não tem lojas e eventos reais.
 * Todo item leva `example: true` e a interface mostra a etiqueta "Exemplo".
 * Nomes, telefones e endereços são fictícios.
 */
const img = (id, w = 1080) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

const DAYS = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo']

// Mesmo formato do Google: "segunda-feira: 11:00 – 22:00"
function week(open, close, closed = []) {
  return DAYS.map((d, i) => `${d}: ${closed.includes(i) ? 'Fechado' : `${open} – ${close}`}`)
}

export const EXAMPLE_STORES = [
  {
    id: 'exemplo-sabor-do-sertao',
    name: 'Sabor do Sertão',
    category: 'gastronomia',
    categoryLabel: 'Restaurante',
    bio: 'Comida regional no fogão a lenha. Almoço todos os dias e música ao vivo às sextas.',
    adTitle: 'Rodízio de carne de sol',
    adText: 'De quinta a domingo, com acompanhamentos à vontade.',
    photos: [img('1517248135467-4c7edcad34c4'), img('1504674900247-0877df9cc836')],
    hours: week('11:00', '22:00', [0]),
    phone: '(79) 99999-0001',
    whatsapp: '5579999990001',
    address: 'Rua do Comércio, 120 — Centro',
  },
  {
    id: 'exemplo-bar-do-mirante',
    name: 'Bar do Mirante',
    category: 'bares',
    categoryLabel: 'Bar',
    bio: 'Petiscos, chope gelado e forró pé de serra com vista para a cidade.',
    adTitle: 'Noite do Forró no Mirante',
    adText: 'Toda sexta, a partir das 21h. Mesa reservada pelo WhatsApp.',
    photos: [img('1514933651103-005eec06c04b'), img('1572116469696-31de0f17cc34')],
    hours: week('17:00', '01:00', [0, 1]),
    phone: '(79) 99999-0002',
    whatsapp: '5579999990002',
    address: 'Av. Beira Rio, 45 — Mirante',
  },
  {
    id: 'exemplo-cafe-da-praca',
    name: 'Café da Praça',
    category: 'gastronomia',
    categoryLabel: 'Cafeteria',
    bio: 'Café coado na hora, bolos caseiros e tapioca. Wi-fi e tomada para trabalhar.',
    adTitle: 'Café da tarde completo',
    adText: 'Bolo, tapioca e café por um preço só, das 15h às 18h.',
    photos: [img('1495474472287-4d71bcdd2085'), img('1509042239860-f550ce710b93')],
    hours: week('07:00', '19:00', [6]),
    phone: '(79) 99999-0003',
    whatsapp: '5579999990003',
    address: 'Praça da Matriz, 8 — Centro',
  },
  {
    id: 'exemplo-studio-bem-viver',
    name: 'Studio Bem Viver',
    category: 'bem-estar',
    categoryLabel: 'Pilates e spa',
    bio: 'Pilates, yoga e massoterapia. Primeira aula experimental gratuita.',
    adTitle: 'Aula experimental grátis',
    adText: 'Pilates ou yoga: agende a sua e conheça o studio.',
    photos: [img('1544367567-0f2fcb009e0b'), img('1540555700478-4be289fbecef')],
    hours: week('06:00', '20:00', [6]),
    phone: '(79) 99999-0004',
    whatsapp: '5579999990004',
    address: 'Rua das Flores, 300 — Jardim',
  },
  {
    id: 'exemplo-espaco-raizes',
    name: 'Espaço Cultural Raízes',
    category: 'cultura',
    categoryLabel: 'Centro cultural',
    bio: 'Exposições, saraus e oficinas de arte popular. Entrada gratuita na galeria.',
    adTitle: 'Exposição Mestres do Barro',
    adText: 'Cerâmica e artesanato da região. Visitação de terça a domingo.',
    photos: [img('1518998053901-5348d3961a04'), img('1460661419201-fd4cecdf8a8b')],
    hours: week('09:00', '18:00', [0]),
    phone: '(79) 99999-0005',
    whatsapp: '5579999990005',
    address: 'Rua da Cultura, 77 — Centro Histórico',
  },
  {
    id: 'exemplo-passeios-rio-real',
    name: 'Passeios Rio Real',
    category: 'turismo',
    categoryLabel: 'Agência de passeios',
    bio: 'Passeios de barco, trilhas guiadas e roteiros de um dia pela região.',
    adTitle: 'Passeio de barco ao pôr do sol',
    adText: 'Saídas diárias às 16h. Crianças até 6 anos não pagam.',
    photos: [img('1469474968028-56623f02e42e'), img('1465146344425-f00d5f5c8f07')],
    hours: week('08:00', '18:00'),
    phone: '(79) 99999-0006',
    whatsapp: '5579999990006',
    address: 'Cais do Porto, s/n — Orla',
  },
].map(s => ({ ...s, example: true }))

// Datas relativas a hoje, para os filtros da agenda sempre terem conteúdo
function at(dayOffset, hour, min = 0) {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, min, 0, 0)
  return d.toISOString()
}

// weekday: 0 = segunda … 6 = domingo, da semana que vem
function nextWeek(weekday, hour) {
  const today = (new Date().getDay() + 6) % 7
  return at(7 - today + weekday, hour)
}

const store = id => EXAMPLE_STORES.find(s => s.id === id)

function storeEvent(storeId, fields) {
  const s = store(storeId)
  return { store_id: s.id, organizer_name: s.name, category: s.category, custom_location: s.address, ...fields }
}

export const EXAMPLE_EVENTS = [
  storeEvent('exemplo-sabor-do-sertao', {
    id: 'exemplo-ev-almoco',
    name: 'Almoço com música ao vivo',
    short_description: 'Trio de forró a partir do meio-dia e buffet regional completo.',
    cover_image_url: img('1414235077428-338989a2e8c0'),
    starts_at: at(0, 12),
    price_info: 'R$ 45 por pessoa',
  }),
  storeEvent('exemplo-bar-do-mirante', {
    id: 'exemplo-ev-forro',
    name: 'Noite do Forró Pé de Serra',
    short_description: 'Sanfona, zabumba e triângulo até a madrugada.',
    cover_image_url: img('1533174072545-7a4b6ad7a6c3'),
    starts_at: at(0, 21),
    price_info: 'R$ 15',
  }),
  storeEvent('exemplo-studio-bem-viver', {
    id: 'exemplo-ev-aulao',
    name: 'Aulão aberto de pilates',
    short_description: 'Aula ao ar livre para todos os níveis. Leve seu tapete.',
    cover_image_url: img('1506126613408-eca07ce68773'),
    starts_at: at(1, 8),
    price_info: 'Gratuito',
  }),
  storeEvent('exemplo-espaco-raizes', {
    id: 'exemplo-ev-sarau',
    name: 'Sarau de poesia e cordel',
    short_description: 'Microfone aberto, repente e lançamento de folhetos.',
    cover_image_url: img('1511795409834-ef04bbd61622'),
    starts_at: at(1, 19),
    price_info: 'Gratuito',
  }),
  storeEvent('exemplo-passeios-rio-real', {
    id: 'exemplo-ev-barco',
    name: 'Passeio de barco ao pôr do sol',
    short_description: 'Duas horas de passeio com parada para banho de rio.',
    cover_image_url: img('1469474968028-56623f02e42e'),
    starts_at: at(2, 16),
    price_info: 'R$ 60',
  }),
  storeEvent('exemplo-cafe-da-praca', {
    id: 'exemplo-ev-degustacao',
    name: 'Degustação de bolos caseiros',
    short_description: 'Seis sabores da casa com café coado à vontade.',
    cover_image_url: img('1509042239860-f550ce710b93'),
    starts_at: at(3, 16),
    price_info: 'R$ 25',
  }),
  storeEvent('exemplo-bar-do-mirante', {
    id: 'exemplo-ev-samba',
    name: 'Quarta do Samba',
    short_description: 'Roda de samba com feijoada e caipirinha em dobro.',
    cover_image_url: img('1492684223066-81342ee5ff30'),
    starts_at: nextWeek(2, 20),
    price_info: 'R$ 20',
  }),
  storeEvent('exemplo-passeios-rio-real', {
    id: 'exemplo-ev-trilha',
    name: 'Trilha guiada da serra',
    short_description: 'Caminhada leve de 6 km com guia local e café da manhã.',
    cover_image_url: img('1465146344425-f00d5f5c8f07'),
    starts_at: nextWeek(5, 7),
    price_info: 'R$ 35',
  }),
  {
    id: 'exemplo-ev-quermesse',
    name: 'Missa campal e quermesse',
    short_description: 'Celebração na praça, barracas de comidas típicas e bingo beneficente.',
    cover_image_url: img('1438232992991-995b7058bbb3'),
    starts_at: nextWeek(6, 17),
    price_info: 'Gratuito',
    category: 'religiao',
    organizer_name: 'Paróquia do Centro',
    custom_location: 'Praça da Matriz',
  },

  // ── Agenda pública: avisos e festas do órgão público ──
  {
    id: 'exemplo-pub-vacina',
    kind: 'aviso',
    name: 'Mutirão de vacinação',
    short_description: 'Postos de saúde abertos das 8h às 17h. Leve documento e cartão de vacina.',
    starts_at: at(0, 8),
    is_public: true,
    organizer_name: 'Prefeitura',
    custom_location: 'Todos os postos de saúde',
  },
  {
    id: 'exemplo-pub-feira',
    kind: 'festa',
    name: 'Feira livre do Centro',
    short_description: 'Hortifrúti, artesanato e comidas típicas direto do produtor.',
    cover_image_url: img('1488459716781-31db52582fe9'),
    starts_at: at(1, 6),
    price_info: 'Entrada gratuita',
    is_public: true,
    organizer_name: 'Prefeitura',
    custom_location: 'Praça do Mercado',
  },
  {
    id: 'exemplo-pub-obras',
    kind: 'aviso',
    name: 'Rua Principal interditada para obras',
    short_description: 'Trecho entre a praça e o mercado fechado das 7h às 17h. Use as ruas paralelas.',
    starts_at: at(2, 7),
    is_public: true,
    organizer_name: 'Prefeitura',
    custom_location: 'Rua Principal — Centro',
  },
  {
    id: 'exemplo-pub-aniversario',
    kind: 'festa',
    name: 'Festa de aniversário da cidade',
    short_description: 'Desfile cívico pela manhã e shows gratuitos na praça à noite.',
    cover_image_url: img('1501281668745-f7f57925c3b4'),
    starts_at: nextWeek(5, 18),
    price_info: 'Entrada gratuita',
    is_public: true,
    organizer_name: 'Prefeitura',
    custom_location: 'Praça de Eventos',
  },
].map(e => ({ ...e, example: true }))
