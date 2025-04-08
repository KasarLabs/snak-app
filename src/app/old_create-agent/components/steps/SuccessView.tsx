import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SuccessViewProps } from "../../types/agent";

const SuccessView: React.FC<SuccessViewProps> = ({
  configId,
  onReset,
  isExisting,
}) => {
  const [copied, setCopied] = useState(false);
  const commandRef = useRef<HTMLSpanElement>(null);
  const copyToClipboard = async () => {
    try {
      const command = commandRef.current?.textContent || "";
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">
        {isExisting
          ? "This agent configuration already exists!"
          : "Your agent has been created!"}
      </h2>
      <p className="text-gray-400 mb-4">
        Here&apos;s the command you can run to get started with your agent:
      </p>

      <motion.div
        className="relative group bg-neutral-800 p-4 rounded-lg border border-neutral-700 cursor-pointer hover:bg-neutral-750 transition-colors max-w-full w-fit"
        onClick={copyToClipboard}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <span
            ref={commandRef}
            className="text-gray-200 font-mono text-sm truncate max-w-[300px]"
          >
            curl -sSL https://agent.kasar.io/setup | bash -s -- {configId}
          </span>
          <motion.div
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            className="flex-shrink-0"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-500" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-400" />
            )}
          </motion.div>
        </div>
      </motion.div>

      <p className="text-sm text-gray-400 mt-4 mb-6"></p>

      <motion.button
        onClick={onReset}
        className="bg-neutral-700 text-white px-6 py-2 rounded-md hover:bg-neutral-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Another Agent
      </motion.button>
    </motion.div>
  );
};

export default SuccessView;
