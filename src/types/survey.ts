
export interface ClientContact {
  name: string;
  email: string;
  phone: string;
}

export interface FlightDetails {
  outbound_date?: string;
  return_date?: string;
  airline?: string;
  confirmation?: string;
}

export interface HotelDetails {
  checkin_date?: string;
  checkout_date?: string;
  hotel_name?: string;
  confirmation?: string;
}

export interface Survey {
  id: string;
  user_id: string;
  client_name: string;
  client_country: string;
  client_contacts: ClientContact[];
  ship_name: string;
  survey_location: string;
  survey_date: string;
  project_scope: string;
  duration: string;
  tools: string[];
  custom_fields: { [key: string]: string };
  flight_details: FlightDetails;
  hotel_details: HotelDetails;
  status: 'draft' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
  last_synced_at: string;
  needs_sync: boolean;
}

export interface SurveyZone {
  id: string;
  survey_id: string;
  zone_name: string;
  zone_type: 'area' | 'cabin' | 'public_zone';
  created_at: string;
}

export interface SurveyNote {
  id: string;
  survey_id: string;
  zone_id: string;
  note_content: string;
  created_at: string;
  updated_at: string;
  last_synced_at: string;
  needs_sync: boolean;
}

export interface SurveyMedia {
  id: string;
  survey_id: string;
  zone_id?: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  storage_path: string;
  thumbnail_path?: string;
  created_at: string;
  local_file_data?: string;
  last_synced_at: string;
  needs_sync: boolean;
}
