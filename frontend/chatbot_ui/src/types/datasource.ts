// src/types/datasource.ts
export interface DataSource {
  id: number;
  title: string;
  source_type: "pdf" | "doc" | "txt";
  description: string;
  location: string;
  processing_status: "unprocessed" | "processing" | "completed" | "failed";
  created_at: string;
  processing_config: any;
}

export interface DataSourceFormData {
  title: string;
  source_type: "pdf" | "doc" | "txt";
  description?: string;
  file?: File;
}
