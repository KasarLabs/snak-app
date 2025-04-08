import { StepProps } from "../../types/agent";
import MultiInputStep from "../MultiInputStep";

const KnowledgeStep: React.FC<StepProps> = ({ formData, setFormData }) => (
  <MultiInputStep
    title="Knowledge"
    values={formData.knowledge}
    onChange={(newKnowledge) =>
      setFormData({ ...formData, knowledge: newKnowledge })
    }
    placeholder="Enter knowledge"
    formData={formData}
    setFormData={setFormData}
  />
);

export default KnowledgeStep;
