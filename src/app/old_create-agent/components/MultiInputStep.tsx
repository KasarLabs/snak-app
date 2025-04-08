import { Info, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MultiInputStepProps } from "../types/agent";

export const MultiInputStep: React.FC<MultiInputStepProps> = ({
  title,
  values,
  onChange,
  placeholder,
}) => {
  const addInput = () => {
    onChange([...values, ""]);
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const removeInput = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const getTooltipContent = (title: string) => {
    switch (title) {
      case "Lore":
        return "Background information and context that defines your agent's personality and knowledge base.";
      case "Objectives":
        return "The specific goals and tasks your agent should strive to accomplish.";
      case "Knowledge":
        return "Specific information and capabilities your agent should be aware of.";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium text-gray-200">{title}</h3>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 cursor-help translate-y-[2px]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipContent(title)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {values.map((value, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-2 items-start"
        >
          <textarea
            value={value}
            onChange={(e) => updateValue(index, e.target.value)}
            className="flex-1 p-2 bg-neutral-800 border border-neutral-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none transition-colors h-32"
            style={{ minHeight: "100px" }}
            placeholder={placeholder}
          />
          <button
            onClick={() => removeInput(index)}
            className="p-2 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-gray-300 transition-colors mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </motion.div>
      ))}
      <motion.button
        onClick={addInput}
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-4 h-4" />
        Add {title.toLowerCase()}
      </motion.button>
    </motion.div>
  );
};
export default MultiInputStep;
