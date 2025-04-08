import { useState, useEffect } from "react";
import Image from "next/image";
import { Plugin } from "../utils/types";
import { CollapsibleSection } from "./CollapsibleSection";

const getGithubUrl = (plugin: Plugin): string | undefined => {
  if (plugin.githubUrl) return plugin.githubUrl;
  if (plugin.image.includes("github.com")) {
    return plugin.image.replace(".png", "/" + plugin.name);
  }
  return undefined;
};

interface PluginModalProps {
  plugin: Plugin | null;
  isVisible: boolean;
  expandedActions: Set<number>;
  onClose: () => void;
  isMobile?: boolean;
}

export const PluginModal = ({
  plugin,
  isVisible,
  onClose,
  isMobile = false,
}: PluginModalProps) => {
  const [expandedActions, setExpandedActions] = useState<Set<number>>(
    new Set(),
  );
  useEffect(() => {
    if (!isVisible) {
      setExpandedActions(new Set());
    }
  }, [isVisible]);
  if (!isVisible || !plugin) return null;

  const githubUrl = getGithubUrl(plugin);

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] bg-black/50">
      <div
        className={`bg-black ${isMobile ? "w-[95%]" : "w-[600px]"} max-h-[80vh] rounded-2xl overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 bg-black ${isMobile ? "p-4" : "p-8"} z-10`}
        >
          <div className="flex items-start justify-between">
            <div className={`flex ${isMobile ? "gap-3" : "gap-6"}`}>
              <div className="flex-shrink-0">
                <Image
                  src={plugin.image}
                  alt={plugin.name}
                  width={isMobile ? 40 : 50}
                  height={isMobile ? 40 : 50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2
                    className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-white`}
                  >
                    {plugin.name}
                  </h2>
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {plugin.description}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white text-xl ml-4">
              ✕
            </button>
          </div>
        </div>

        {/* Actions List */}
        <div className={`${isMobile ? "p-3" : "p-5"} pt-0`}>
          {plugin.actions.map((action, index) => (
            <CollapsibleSection
              key={index}
              title={action.name}
              defaultOpen={expandedActions.has(index)}
              isMobile={isMobile}
            >
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">{action.description}</p>

                {action.parameters && action.parameters.length > 0 && (
                  <div className="space-y-3">
                    {action.parameters.map((param, paramIndex) => (
                      <div
                        key={paramIndex}
                        className={`bg-neutral-900 rounded-lg ${isMobile ? "p-2" : "p-3"} border border-neutral-800`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium">
                            {param.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-white/20 rounded-full px-2 py-1 text-white">
                              {param.type}
                            </span>
                            {param.required && (
                              <span className="text-xs text-red-400">
                                required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          ))}
        </div>
      </div>
    </div>
  );
};
