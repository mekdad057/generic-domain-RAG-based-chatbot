export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'admin' | 'user';
  date_joined: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface DataSource {
  id: number;
  title: string;
  source_type: 'pdf' | 'doc' | 'txt';
  location: string;
  description: string;
  created_at: string;
  processing_status: 'unprocessed' | 'processing' | 'completed' | 'failed';
  processing_config: Record<string, any> | null;
  created_by: number;
}

export interface CreateDataSourceData {
  title: string;
  source_type: 'pdf' | 'doc' | 'txt';
  description?: string;
  file: File; // For file upload
}

export interface UpdateDataSourceData {
  title?: string;
  description?: string;
  // Note: location and processing_status are read-only
}

export interface ProcessDataSourceConfig {
  chunk_size?: number;
  overlap?: number;
  embedding_model?: string;
  [key: string]: any; // Allow additional config options
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUserProfile: (profileData: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}