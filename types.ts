export enum ViewState {
  ARCHITECTURE = 'ARCHITECTURE',
  PIPELINE = 'PIPELINE',
  PARALLELISM = 'PARALLELISM',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GpuComponent {
  id: string;
  name: string;
  details: string;
  gridArea: string;
}