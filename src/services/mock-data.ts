export interface Participant {
  id: string;
  name: string;
  phone: string;
  accountNumber?: string;
  career?: string;
  email: string;
  cardsCount: number;
  isPaid: boolean;
  isDelivered: boolean;
  deliveredBy: string | null;
  deliveredAt: string | null;
  emailSent: boolean;
}

// Datos iniciales de prueba basados en los mockups
export const initialParticipants: Participant[] = [
  {
    id: '01f5472a-46c0-4054-b947-6f1d3a542252',
    name: 'Jeremy Geovanny Figueroa Aguilera',
    phone: '33660420',
    accountNumber: '20191031190',
    career: 'Ingeniería en sistemas',
    email: 'jeremy.figueroa@unah.hn',
    cardsCount: 2,
    isPaid: true,
    isDelivered: true,
    deliveredBy: 'usuario 5',
    deliveredAt: '4 de abril de 2025, 12:55',
    emailSent: true,
  },
  {
    id: 'ana-maria-pineda',
    name: 'Ana Maria Pineda',
    phone: '99221144',
    accountNumber: '20211030012',
    career: 'Ingeniería en sistemas',
    email: 'ana.pineda@unah.hn',
    cardsCount: 1,
    isPaid: true,
    isDelivered: false,
    deliveredBy: null,
    deliveredAt: null,
    emailSent: false,
  },
  {
    id: 'carlos-martinez',
    name: 'Carlos Martinez Lagos',
    phone: '88337722',
    accountNumber: '20201004561',
    career: 'Ingeniería en sistemas',
    email: 'carlos.martinez@unah.hn',
    cardsCount: 5,
    isPaid: true,
    isDelivered: true,
    deliveredBy: 'usuario 2',
    deliveredAt: '5 de abril de 2025, 10:15',
    emailSent: true,
  },
  {
    id: 'diana-valeria',
    name: 'Diana Valeria Ramos',
    phone: '95881234',
    accountNumber: '20221010998',
    career: 'Ingeniería en sistemas',
    email: 'diana.ramos@unah.hn',
    cardsCount: 3,
    isPaid: false,
    isDelivered: false,
    deliveredBy: null,
    deliveredAt: null,
    emailSent: true,
  },
  {
    id: 'hector-ivan',
    name: 'Hector Ivan Suazo',
    phone: '31229988',
    accountNumber: '20181020334',
    career: 'Ingeniería en sistemas',
    email: 'hector.suazo@unah.hn',
    cardsCount: 1,
    isPaid: true,
    isDelivered: true,
    deliveredBy: 'usuario 5',
    deliveredAt: '3 de abril de 2025, 16:20',
    emailSent: true,
  }
];

// Helper en memoria para simular base de datos persistente durante la navegación local
export const getParticipants = (): Participant[] => {
  const data = localStorage.getItem('bingo_participants');
  if (!data) {
    localStorage.setItem('bingo_participants', JSON.stringify(initialParticipants));
    return initialParticipants;
  }
  return JSON.parse(data);
};

export const updateParticipant = (updated: Participant) => {
  const current = getParticipants();
  const index = current.findIndex(p => p.id === updated.id);
  if (index !== -1) {
    current[index] = updated;
    localStorage.setItem('bingo_participants', JSON.stringify(current));
  }
};

export const addParticipant = (newParticipant: Participant) => {
  const current = getParticipants();
  current.push(newParticipant);
  localStorage.setItem('bingo_participants', JSON.stringify(current));
};
