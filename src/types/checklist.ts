
export interface ChecklistQuestion {
  id: string;
  category: string;
  subcategory?: string;
  text: string;
  mandatory: boolean;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_default: boolean;
  compliance_standards: string[];
  questions: ChecklistQuestion[];
  created_at: string;
}

export interface ChecklistResponse {
  id: string;
  survey_id: string;
  zone_id?: string;
  template_id?: string;
  question_id: string;
  question_category: string;
  question_text: string;
  response_type: 'yes' | 'no' | 'na' | 'skipped';
  is_mandatory: boolean;
  notes?: string;
  asset_tag?: string;
  qr_code?: string;
  rfid_tag?: string;
  created_at: string;
  updated_at: string;
  needs_sync: boolean;
}

export interface ChecklistMedia {
  id: string;
  response_id: string;
  survey_id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  storage_path: string;
  local_file_data?: string;
  evidence_type: 'defect' | 'compliance' | 'reference';
  created_at: string;
  needs_sync: boolean;
}
