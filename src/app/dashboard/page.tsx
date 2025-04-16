'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';


function ButtonBar({
  config,
  setConfig,
  listConfig,
  setListConfig,
}: {
  config: string;
  setConfig: (config: string) => void;
  listConfig: string[];
  setListConfig: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isConfigSelectorOpen, setIsConfigSelectorOpen] = useState(false);
  const [pinnedConfigs, setPinnedConfigs] = useState<string[]>([]);
  const [allConfigs, setAllConfigs] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const appWebview = getCurrentWebviewWindow();
  appWebview.listen('reload-configs', (event) => {
    console.log(`Event Triggered`);
    // Incrémentez le reloadTrigger pour déclencher le useEffect
    setReloadTrigger(prev => prev + 1);
  
  });

  const toggleConfigSelector = () => {
    setIsConfigSelectorOpen(!isConfigSelectorOpen);
  };

  useEffect(() => {
    const getConfig = async () => {
      try {
        const configs: any = await invoke('get_agents_config', {});
        const configNames = configs.map((config: any) => config.name);
        setAllConfigs(configNames);

        // Initialize with up to 5 pinned configs from localStorage or use the first 5
        const savedPinned = localStorage.getItem('pinnedConfigs');
        if (savedPinned) {
          const parsed = JSON.parse(savedPinned);
          const validPinned = parsed
            .filter((name: string) => configNames.includes(name))
            .slice(0, 5);
          setPinnedConfigs(validPinned);
          setListConfig(validPinned);
        } else {
          const initialPinned = configNames.slice(0, 5);
          setPinnedConfigs(initialPinned);
          setListConfig(initialPinned);
          localStorage.setItem('pinnedConfigs', JSON.stringify(initialPinned));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des configurations:', error);
      }
    };

    getConfig();
  }, [reloadTrigger]);

  const handleConfigClick = (configName: string) => {
    setConfig(configName);
    console.log(`Configuration définie sur: ${configName}`);
  };

  const togglePinConfig = (configName: string) => {
    let newPinnedConfigs: string[];

    if (pinnedConfigs.includes(configName)) {
      // Unpin
      newPinnedConfigs = pinnedConfigs.filter((name) => name !== configName);
    } else {
      // Pin (only if we have less than 5)
      if (pinnedConfigs.length >= 5) {
        return; // Maximum reached
      }
      newPinnedConfigs = [...pinnedConfigs, configName];
    }

    setPinnedConfigs(newPinnedConfigs);
    setListConfig(newPinnedConfigs);
    localStorage.setItem('pinnedConfigs', JSON.stringify(newPinnedConfigs));

    // Close the selector after making a change
    setIsConfigSelectorOpen(false);
  };

  return (
    <>
      <div className="flex h-16 w-full items-center justify-between rounded-lg bg-zinc-900 px-4 shadow-md">
        <div className="no-scrollbar flex space-x-3 overflow-x-auto py-2 md:space-x-4">
          <Link href="/">
            <button className="focus:ring-opacity-50 flex h-10 w-16 items-center justify-center rounded-md border border-zinc-700 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none">
              <Image
                src="/home.svg"
                alt="Home"
                width={20}
                height={20}
                priority
                className="brightness-100 invert filter"
              />
            </button>
          </Link>

          {pinnedConfigs.map((configName, index) => (
            <button
              key={index}
              onClick={() => handleConfigClick(configName)}
              className={`flex h-10 w-40 items-center justify-center rounded-md border px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                config === configName
                  ? 'border-blue-500 bg-zinc-800 text-blue-400'
                  : 'border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
              } focus:ring-opacity-50 focus:ring-2 focus:ring-zinc-500 focus:outline-none`}
            >
              {configName}
            </button>
          ))}

          <button
            onClick={toggleConfigSelector}
            className="focus:ring-opacity-50 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
          >
            <span className="text-lg font-medium">+</span>
          </button>
        </div>

        <div className="flex space-x-3 md:space-x-4">
          <button
            onClick={toggleOverlay}
            className="focus:ring-opacity-50 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 p-2 text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
          >
            <Image
              src="/SN-logo.png"
              alt="SN Logo"
              width={24}
              height={20}
              priority
              className="object-contain"
            />
          </button>
        </div>
      </div>

      {/* Configuration Selector Overlay */}
      {isConfigSelectorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm"
          onClick={() => setIsConfigSelectorOpen(false)}
        >
          <div
            className="w-full max-w-md transform rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-bold text-white">Gérer les configurations</h2>
              <button
                onClick={() => setIsConfigSelectorOpen(false)}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
            </div>

            <p className="mb-4 text-sm text-zinc-400">
              Sélectionnez jusqu'à 5 configurations à épingler dans la barre.
            </p>

            <div className="custom-scrollbar max-h-80 space-y-2 overflow-y-auto pr-2">
              {allConfigs.map((configName, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md p-3 hover:bg-zinc-800"
                >
                  <div className="flex items-center">
                    <span className="text-zinc-300">{configName}</span>
                    {config === configName && (
                      <span className="ml-2 rounded bg-blue-400/10 px-2 py-1 text-xs text-blue-400">
                        Actif
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => togglePinConfig(configName)}
                    className={`rounded-md p-1.5 ${
                      pinnedConfigs.includes(configName)
                        ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                        : 'text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {pinnedConfigs.includes(configName) ? (
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
                        <path d="m3 11 18-5v12L3 14v-3z"></path>
                        <path d="M11 11 7.5 21"></path>
                      </svg>
                    ) : (
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
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end border-t border-zinc-800 pt-3">
              <button
                onClick={() => setIsConfigSelectorOpen(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Overlay */}
      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200"
          onClick={toggleOverlay}
        >
          <div
            className="w-full max-w-md transform rounded-lg p-8 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Textarea
              value={message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevents adding a new line
                  setMessage(''); // Clear the input
                  toggleOverlay();
                }
              }}
              placeholder="How can I help you today?"
              className="h-20 min-h-20 w-[100%] resize-none rounded-md border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-transparent focus:ring-2 focus:ring-zinc-600 focus:outline-none"
            />
          </div>
        </div>
      )}
    </>
  );
}

function EnvDashboard({ config }: { config: string }) {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const openOverlay = (overlayName: string) => {
    setActiveOverlay(overlayName);
  };

  const handleDeleteConfigClick = async (configName: string) => {
    const result = await invoke('submit_delete_agent_config', { agentConfigName : configName });
    if (!result) {
      console.error('Erreur lors de la suppression de la configuration:', result);
      return;
    }
    console.log(`Configuration supprimée: ${configName}`);
    closeOverlay();
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-8rem)] w-[30%] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
        <div className="flex w-full flex-col gap-6 p-6">
          <h2 className="mb-4 border-b border-zinc-800 pb-3 text-xl font-bold text-white">
            Environment Dashboard
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => openOverlay('environments')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-zinc-700 px-4 py-3 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-layers"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>Environments</span>
            </button>

            <button
              onClick={() => openOverlay('configuration')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-zinc-700 px-4 py-3 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-settings"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Configuration</span>
            </button>

            <button
              onClick={() => openOverlay('plugins')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-zinc-700 px-4 py-3 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-puzzle"
              >
                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.452-.968-.878-.165-.425-.38-.829-.706-1.155a3.56 3.56 0 0 0-1.155-.706c-.425-.166-.808-.498-.878-.968a.979.979 0 0 1 .277-.837l1.611-1.611a2.403 2.403 0 0 1 1.704-.706 2.4 2.4 0 0 1 1.704.706l1.568 1.568c.23.23.556.338.878.29.138-.02.265-.063.376-.126.224-.12.424-.28.586-.468A.794.794 0 0 0 24 10.5c0-.171-.054-.336-.156-.478-.135-.188-.307-.346-.504-.468a1.838 1.838 0 0 1-.479-.372L21.15 7.474a.988.988 0 0 1-.289-.879c.015-.137.048-.265.097-.388.12-.245.282-.47.491-.652A.794.794 0 0 0 21.75 5c0-.171-.054-.336-.156-.478-.103-.143-.241-.25-.387-.321a2.897 2.897 0 0 0-.61-.24 1.698 1.698 0 0 0-.662-.046 1.05 1.05 0 0 0-.465.144 1.63 1.63 0 0 0-.479.372L17.21 6.211c-.23.23-.348.556-.3.878.07.47.452.802.878.968.425.165.83.38 1.155.706.326.326.54.73.706 1.155.116.298.326.54.624.624.097.027.194.039.29.039.2 0 .393-.078.547-.232l1.611-1.611a2.403 2.403 0 0 0 .706-1.704 2.4 2.4 0 0 0-.706-1.704l-1.568-1.568a1.026 1.026 0 0 0-.878-.29c-.322.049-.587.274-.716.586-.166.425-.38.83-.706 1.156-.326.326-.73.54-1.156.706-.425.166-.802.452-.968.878a.979.979 0 0 0 .277.837l1.611 1.611a2.403 2.403 0 0 0 1.704.706 2.4 2.4 0 0 0 1.704-.706l1.568-1.568a1.026 1.026 0 0 1 .878-.29c.322.049.587.274.716.586.166.425.38.83.706 1.156.326.326.73.54 1.155.706.426.166.803.452.968.878a.98.98 0 0 1-.276.837l-1.611 1.611a2.403 2.403 0 0 1-1.704.706 2.4 2.4 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 1-.878-.29c-.322.049-.587.274-.716.586"></path>
                <path d="M8.5 21H7a2 2 0 0 1-2-2v-1.5"></path>
                <path d="M2 13V7a2 2 0 0 1 2-2h4"></path>
                <path d="M13.929 9.5 12 7.571 10.071 9.5 12 11.429l1.929-1.929Z"></path>
              </svg>
              <span>Plugins</span>
            </button>

            <button
              onClick={() => openOverlay('memories')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-zinc-700 px-4 py-3 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-brain"
              >
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
              </svg>
              <span>Memories</span>
            </button>

            <button
              onClick={() => openOverlay('metrics')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-zinc-700 px-4 py-3 text-sm text-white transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-bar-chart"
              >
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <span>Metrics</span>
            </button>
          </div>
          <div></div>
          <div className="mt-auto space-y-3 border-t border-zinc-800 pt-6">
            <div className="rounded-md bg-zinc-800 p-4 text-xs text-zinc-400">
              <p className="mb-1 font-medium text-zinc-300">Agent Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </div>
            </div>
            <button
              onClick={() => openOverlay('delete-agents')}
              className="focus:ring-opacity-50 flex w-full items-center space-x-3 rounded-md border border-red-800 px-4 py-3 text-sm text-red-700 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:outline-none"
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
                className="lucide-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Delete config : {config}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Overlays pour chaque section */}
      {activeOverlay === 'environments' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Environments</h2>
              <button
                onClick={closeOverlay}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Environment Name
                </label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  placeholder="Production"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Environment Type
                </label>
                <select className="w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Description</label>
                <Textarea
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  placeholder="Environment description..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Base URL</label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800">
                  Cancel
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Save Environment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeOverlay === 'configuration' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Configuration</h2>
              <button
                onClick={closeOverlay}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">API Key</label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Timeout (ms)</label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="number"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Max Retries</label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="number"
                  placeholder="3"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="debugMode"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                />
                <label htmlFor="debugMode" className="text-sm text-zinc-400">
                  Enable Debug Mode
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800">
                  Cancel
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeOverlay === 'plugins' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Plugins</h2>
              <button
                onClick={closeOverlay}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="plugin1"
                    className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  />
                  <div>
                    <h3 className="font-medium text-white">Data Connector</h3>
                    <p className="text-xs text-zinc-500">Connect to various data sources</p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-400">Configure</button>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="plugin2"
                    className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  />
                  <div>
                    <h3 className="font-medium text-white">Authentication</h3>
                    <p className="text-xs text-zinc-500">OAuth and API key management</p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-400">Configure</button>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="plugin3"
                    className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  />
                  <div>
                    <h3 className="font-medium text-white">Export Tools</h3>
                    <p className="text-xs text-zinc-500">Export data in various formats</p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-400">Configure</button>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800">
                  Add New Plugin
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeOverlay === 'memories' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Memory Configuration</h2>
              <button
                onClick={closeOverlay}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">Memory Type</label>
                <select className="w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                  <option value="short">Short-term</option>
                  <option value="long">Long-term</option>
                  <option value="episodic">Episodic</option>
                  <option value="semantic">Semantic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Memory Size (MB)
                </label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="number"
                  placeholder="512"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Retention Period (days)
                </label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="number"
                  placeholder="30"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="persistent"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                />
                <label htmlFor="persistent" className="text-sm text-zinc-400">
                  Persistent Storage
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800">
                  Reset Memory
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeOverlay === 'metrics' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Metrics Configuration</h2>
              <button
                onClick={closeOverlay}
                className="rounded-full p-1 hover:bg-zinc-800 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trackUsage"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  checked
                />
                <label htmlFor="trackUsage" className="text-sm text-zinc-400">
                  Track API Usage
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trackPerformance"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  checked
                />
                <label htmlFor="trackPerformance" className="text-sm text-zinc-400">
                  Track Performance
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trackErrors"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  checked
                />
                <label htmlFor="trackErrors" className="text-sm text-zinc-400">
                  Track Errors
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trackUserInteractions"
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-600"
                  checked
                />
                <label htmlFor="trackUserInteractions" className="text-sm text-zinc-400">
                  Track User Interactions
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Data Retention Period (days)
                </label>
                <Input
                  className="w-full border-zinc-700 bg-zinc-800 text-white"
                  type="number"
                  placeholder="90"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Export Format
                </label>
                <select className="w-full rounded-md border-zinc-700 bg-zinc-800 px-3 py-2 text-white">
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800">
                  Export Metrics
                </button>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{' '}
      {activeOverlay === 'delete-agents' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div
            className="w-full max-w-2xl transform rounded-lg border border-zinc-700 bg-zinc-900 p-6 shadow-xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex justify-center">Do you want to delete {config}</span>
            <div className="flex justify-center space-x-3 pt-4">
              <button
                onClick={closeOverlay}
                className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await handleDeleteConfigClick(config);
                    // Traitement après l'exécution réussie
                  } catch (error) {
                    // Gestion d'erreur
                    console.error(error);
                  }
                }}
                className="rounded-md border border-red-700 px-4 py-2 text-red-800 hover:bg-zinc-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Terminal({ config }: { config: string }) {
  const [message, setMessage] = useState<string>('');
  const [discussion, setDiscussion] = useState<Map<'question' | 'response', string>>(new Map());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    console.log('Message soumis:', message);
    console.log('Configuration active:', config);

    setDiscussion((prev) => new Map(prev).set('question', message));

    try {
      const response: string = await invoke('server_request', {
        input: message,
        agentconfig: config,
      });

      setDiscussion((prev) => new Map(prev).set('response', response));
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setDiscussion((prev) =>
        new Map(prev).set('response', 'Error: Unable to process your request. Please try again.')
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-[70%] flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-md">
      <div className="flex w-full items-center justify-center border-b border-zinc-700 bg-zinc-800 p-3 text-center font-medium text-white">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Agent actif: {config}</span>
        </div>
      </div>

      <div className="custom-scrollbar flex w-full flex-1 flex-col gap-4 overflow-auto bg-zinc-950 p-6">
        {discussion.size === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-zinc-600"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3 className="mb-2 text-lg font-medium text-zinc-300">Commencez une conversation</h3>
              <p className="text-zinc-500">
                Posez une question à votre agent pour démarrer la conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            {discussion.has('question') && (
              <div className="mb-4 flex w-full justify-end">
                <div className="max-w-[80%] rounded-lg bg-zinc-700 p-4 break-words text-zinc-100 shadow-sm">
                  {discussion.get('question')}
                </div>
              </div>
            )}
            {discussion.has('response') && (
              <div className="flex w-full justify-start">
                <div className="max-w-[80%] rounded-lg bg-blue-600 p-4 break-words text-white shadow-sm">
                  {discussion.get('response')}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex min-h-[100px] w-full items-center justify-center gap-4 border-t border-zinc-800 bg-zinc-900 p-4"
      >
        <Textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="How can I help you today?"
          className="h-20 min-h-20 w-[80%] resize-none rounded-md border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-transparent focus:ring-2 focus:ring-zinc-600 focus:outline-none"
        />
        <Button
          type="submit"
          className="focus:ring-opacity-50 h-12 rounded-md bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const [config, setConfig] = useState('SAK Guide Agent');
  const [listConfig, setListConfig] = useState<Array<string>>([]);

  return (
    <div className="flex min-h-screen w-screen flex-col gap-4 bg-black p-6 text-white">
      <ButtonBar
        config={config}
        setConfig={setConfig}
        listConfig={listConfig}
        setListConfig={setListConfig}
      />
      <div className="flex h-full flex-1 flex-row gap-6">
        <EnvDashboard config={config} />
        <Terminal config={config} />
      </div>
    </div>
  );
}
