import { StepProps } from "../../types/agent";
import MultiInputStep from "../MultiInputStep";

const ObjectivesStep: React.FC<StepProps> = ({ formData, setFormData }) => (
  <MultiInputStep
    title="Objectives"
    values={formData.objectives}
    onChange={(newObjectives) =>
      setFormData({ ...formData, objectives: newObjectives })
    }
    placeholder="Enter objective"
    formData={formData}
    setFormData={setFormData}
  />
);

export default ObjectivesStep;
