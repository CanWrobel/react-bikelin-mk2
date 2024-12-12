export interface Incident {
    _id: string;
    title: string;
    longitude: number;
    latitude: number;
    description?: string;
    date?: string;
    time?: string;
    category?: string;
    timeCategory?: string;
    street?: string;
    zip?: number;
    city?: string;
    username?: string;
    image?: string;
    incident_id?: number;
    __v?: number;
  }
  