
export interface TrackingStep {
  id: string;
  status: string;
  location: string;
  date: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TrackingData {
  code: string;
  status: string;
  currentLocation?: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  steps: TrackingStep[];
}

const STORAGE_KEY = 'ship-easy-tracking-data';

// Initial mock data to populate if empty
const INITIAL_DATA: TrackingData[] = [
  {
    code: "BR123456789",
    status: "Em Trânsito",
    currentLocation: "Rodovia Presidente Dutra, km 150",
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    estimatedDelivery: "05/02/2026",
    steps: [
      {
        id: "1",
        status: "Pedido Recebido",
        location: "São Paulo, SP - Centro de Distribuição",
        date: "01/02/2026",
        time: "09:30",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: "2",
        status: "Em Separação",
        location: "São Paulo, SP - Centro de Distribuição",
        date: "01/02/2026",
        time: "11:45",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: "3",
        status: "Coletado",
        location: "São Paulo, SP - Transportadora",
        date: "02/02/2026",
        time: "08:00",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: "4",
        status: "Em Trânsito",
        location: "Rodovia Presidente Dutra, km 150",
        date: "03/02/2026",
        time: "14:20",
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: "5",
        status: "Saiu para Entrega",
        location: "Rio de Janeiro, RJ",
        date: "-",
        time: "-",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "6",
        status: "Entregue",
        location: "Rio de Janeiro, RJ",
        date: "-",
        time: "-",
        isCompleted: false,
        isCurrent: false,
      },
    ],
  },
  {
    code: "BR236472641200023",
    status: "Postado",
    currentLocation: "Distribuição lalamove",
    origin: "Av. Rio das Pedras, 2920 - Jardim Aricanduva, São Paulo",
    destination: "Rua Atilio Brum 33 Estrada Dos Caboclos - 23040-175",
    estimatedDelivery: "16/02/2026",
    steps: [
      {
        id: "1",
        status: "Pedido Recebido",
        location: "Av. Rio das Pedras, 2920 - Jardim Aricanduva, São Paulo",
        date: "15/02/2026",
        time: "08:00",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: "2",
        status: "Postado",
        location: "Av. Rio das Pedras, 2920 - Jardim Aricanduva, São Paulo",
        date: "15/02/2026",
        time: "10:00",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: "3",
        status: "Distribuição lalamove",
        location: "São Paulo, SP - Centro de Distribuição",
        date: "-",
        time: "-",
        isCompleted: false,
        isCurrent: true,
      },
      {
        id: "4",
        status: "Saiu para Entrega",
        location: "Rio de Janeiro, RJ",
        date: "-",
        time: "-",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "5",
        status: "Entregue",
        location: "Rio de Janeiro, RJ",
        date: "-",
        time: "-",
        isCompleted: false,
        isCurrent: false,
      }
    ],
  },
];

export const getTrackingData = (code: string): TrackingData | null => {
  const data = getAllTrackingData();
  return data.find((t) => t.code.toUpperCase() === code.toUpperCase()) || null;
};

export const getAllTrackingData = (): TrackingData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

export const saveTrackingData = (tracking: TrackingData) => {
  const data = getAllTrackingData();
  const index = data.findIndex((t) => t.code === tracking.code);
  
  if (index >= 0) {
    data[index] = tracking;
  } else {
    data.push(tracking);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const deleteTrackingData = (code: string) => {
  const data = getAllTrackingData();
  const newData = data.filter((t) => t.code !== code);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};
