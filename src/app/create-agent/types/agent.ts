export interface AgentData {
  name: string;
  bio: string;
  interval: number;
  lore: string[];
  objectives: string[];
  knowledge: string[];
  plugins: string[];
  memory: boolean;
  autonomous: boolean;
}

export interface StepProps {
  formData: AgentData;
  setFormData: React.Dispatch<React.SetStateAction<AgentData>>;
}

export interface MultiInputStepProps extends StepProps {
  title: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  placeholder: string;
}

export interface SuccessViewProps {
  configId: string;
  onReset: () => void; // Add reset function prop
  isExisting: boolean;
}
