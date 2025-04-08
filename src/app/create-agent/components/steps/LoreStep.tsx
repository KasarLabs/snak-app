import { StepProps } from "../../types/agent";
import MultiInputStep from "../MultiInputStep";

const LoreStep: React.FC<StepProps> = ({ formData, setFormData }) => (
  <MultiInputStep
    title="Lore"
    values={formData.lore}
    onChange={(newLore) => setFormData({ ...formData, lore: newLore })}
    placeholder="Enter lore details"
    formData={formData}
    setFormData={setFormData}
  />
);

export default LoreStep;
