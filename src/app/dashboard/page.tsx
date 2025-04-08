'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { mockData } from '@/utils/mock';
import { invoke } from '@tauri-apps/api/core';
import { getCipherInfo } from 'crypto';

function ButtonBar({ config, setConfig, listConfig, setListConfig }: {
  config: string;
  setConfig: (config: string) => void;
  listConfig: string[];
  setListConfig: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };
  
  useEffect(() => {
    const getConfig = async () => {
      try {
        const configs: any = await invoke('get_agents_config', {});
        const configNames = configs.map((config: any) => config.name);
        setListConfig(configNames);
      } catch (error) {
        console.error("Erreur lors de la récupération des configurations:", error);
      }
    };
    
    getConfig();
  }, []); 
  
  const handleConfigClick = (configName: string) => {
    setConfig(configName);
    console.log(`Configuration définie sur: ${configName}`);
  };
  
  return (
    <>
      <div className="flex h-14 w-full items-center justify-between bg-black">
        <div className="flex space-x-2 md:space-x-4">
          <Link href="/">
            <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
              <Image
                src="/home.svg"
                alt="Home"
                width={24}
                height={20}
                priority
                className="h-full w-full object-contain brightness-100 invert filter"
              />
            </button>
          </Link>
          
          {/* Boucle à travers listConfig pour créer des boutons */}
          {listConfig.map((configName, index) => (
            <button
              key={index}
              onClick={() => handleConfigClick(configName)}
              className={`rounded-md border ${
                config === configName ? 'border-blue-500' : 'border-gray-700'
              } px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm`}
            >
              {configName}
            </button>
          ))}
          
          <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
            +
          </button>
        </div>
        <div className="flex space-x-2 md:space-x-4">
          <button
            onClick={toggleOverlay}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 p-2 text-white transition-colors hover:bg-gray-800"
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

      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={toggleOverlay}
        >
          <div className="rounded-lg bg-gray-900 p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-xl font-bold text-white">Menu Overlay</h2>
            <p className="mb-4 text-white">
              Vous pouvez ajouter le contenu de votre overlay ici.
            </p>
            <button
              onClick={toggleOverlay}
              className="rounded-md border border-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// EnvDashboard en tant que composant séparé
function EnvDashboard() {
  return (
    <div className="flex min-h-[400px] w-[30%] border border-gray-700 bg-black">
      <div className="flex w-full flex-col gap-8 p-4">
        <h2 className="mb-4 text-xl font-bold">Environment Dashboard</h2>
        <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
          Environments
        </button>
        <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
          Configuration
        </button>
        <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
          Plugins
        </button>
        <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
          Memories
        </button>
        <button className="rounded-md border border-gray-700 px-4 py-3 text-xs text-white transition-colors hover:bg-gray-800 md:text-sm">
          Metrics
        </button>
      </div>
    </div>
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
    
    const response: string = await invoke('server_request', {
      input: message,
      agentconfig: config
    });
    
    setDiscussion((prev) => new Map(prev).set('response', response));
    setMessage('');
  };
  
  return (
    <div className="flex min-h-[75%] w-[70%] flex-col items-center gap-4 border border-gray-700">
      <div className="w-full bg-gray-800 p-2 text-center text-white">
        Agent actif: {config}
      </div>
      
      <div className="flex min-h-[80%] w-[100%] flex-col gap-4 overflow-auto border border-gray-700 p-4">
        {discussion.size === 0 ? (
          <p className="mb-8 max-w-full px-4 text-center break-words">
            Start the conversation by asking a question!
          </p>
        ) : (
          <>
            {discussion.has('question') && (
              <div className="flex w-full justify-end">
                <div className="max-w-[80%] rounded-lg bg-gray-600 p-3 break-words text-white">
                  {discussion.get('question')}
                </div>
              </div>
            )}
            {discussion.has('response') && (
              <div className="flex w-full justify-start">
                <div className="max-w-[80%] rounded-lg bg-blue-700 p-3 break-words text-white">
                  {discussion.get('response')}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex min-h-[15%] w-[100%] items-center justify-center gap-4 border border-gray-700"
      >
        <Textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="How can I help you today?"
          className="h-12 min-h-12 w-[80%] resize-y rounded-md border-gray-600 bg-gray-900 text-lg text-white placeholder:text-gray-400"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default function Dashboard() {
  const [config, setConfig] = useState("SAK Guide Agent");
  const [listConfig, setListConfig] = useState<Array<string>>([]);

  return (
    <div className="flex min-h-screen w-screen flex-col gap-4 bg-black p-4 text-white">
      <ButtonBar 
        config={config} 
        setConfig={setConfig} 
        listConfig={listConfig} 
        setListConfig={setListConfig} 
      />
      <div className="flex h-full flex-1 flex-row gap-4">
        <EnvDashboard />
        <Terminal config={config} />
      </div>
    </div>
  );
}