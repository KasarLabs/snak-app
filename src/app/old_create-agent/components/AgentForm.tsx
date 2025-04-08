// AgentForm.tsx
import { BasicInfoStep, LoreStep, ObjectivesStep, KnowledgeStep, PluginsStep } from './steps';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AgentData } from '../types/agent';
import { v4 as uuidv4 } from 'uuid';
import SuccessView from './steps/SuccessView';
import StyledAgentForm from './StyledAgentForm';

export const allPlugins = [
  { name: 'plugin1', internal: true },
  { name: 'plugin2', internal: false },
  { name: 'plugin3', internal: true },
  { name: 'plugin4', internal: false },
  { name: 'plugin5' },
];
import { invoke } from '@tauri-apps/api/core';
// function getJsonHash(
//   obj: Record<string, unknown>,
//   excludeFields: string[] = []
// ): string {
//   const clone = JSON.parse(JSON.stringify(obj));
//   const removeFields = (object: Record<string, unknown>) => {
//     for (const key in object) {
//       if (excludeFields.includes(key)) {
//         delete object[key];
//       } else if (typeof object[key] === "object" && object[key] !== null) {
//         removeFields(object[key] as Record<string, unknown>);
//       }
//     }
//     return object;
//   };

//   const str = JSON.stringify(removeFields(clone));

//   let hash1 = 0;
//   let hash2 = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash1 = (hash1 << 5) - hash1 + char;
//     hash1 = hash1 & hash1;
//     hash2 = (hash2 << 5) + hash2 + char;
//     hash2 = hash2 & hash2;
//   }

//   const firstHalf = Math.abs(hash1).toString(16).padStart(8, "0");
//   const secondHalf = Math.abs(hash2).toString(16).padStart(8, "0");
//   return firstHalf + secondHalf;
// }

const AgentForm = () => {
  const initialFormData: AgentData = {
    name: '',
    bio: '',
    interval: 60,
    lore: [''], // Start with one empty lore box
    objectives: [''], // Start with one empty objective box
    knowledge: [''], // Start with one empty knowledge box
    plugins: [],
    memory: false,
    autonomous: false,
  };

  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [configId, setConfigId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AgentData>(initialFormData);
  const [isExisting, setIsExisting] = useState(false);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.name.trim() || !formData.bio.trim()) {
        toast({
          variant: 'destructive',
          title: 'Required information',
          description: 'Please fill in all required fields before continuing.',
          duration: 3000,
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };
  const resetForm = () => {
    setFormData(initialFormData);
    setConfigId(null);
    setCurrentStep(0);
  };

  const steps = useMemo(
    () => [
      {
        title: 'Basic Info',
        component: <BasicInfoStep formData={formData} setFormData={setFormData} />,
      },
      {
        title: 'Lore',
        component: <LoreStep formData={formData} setFormData={setFormData} />,
      },
      {
        title: 'Objectives',
        component: <ObjectivesStep formData={formData} setFormData={setFormData} />,
      },
      {
        title: 'Knowledge',
        component: <KnowledgeStep formData={formData} setFormData={setFormData} />,
      },
      {
        title: 'Plugins',
        component: <PluginsStep formData={formData} setFormData={setFormData} />,
      },
    ],
    [formData, setFormData]
  );

  const handleSubmit = async () => {
    const selectedPluginIds = formData.plugins;
    const internal_plugins: string[] = [];
    const external_plugins: string[] = [];
    selectedPluginIds.forEach((pluginName) => {
      const plugin = allPlugins.find((p) => p.name === pluginName);
      if (plugin) {
        if (plugin.internal ?? true) {
          internal_plugins.push(pluginName);
        } else {
          external_plugins.push(pluginName);
        }
      }
    });

    try {
      const agentConfig = {
        name: formData.name,
        bio: formData.bio,
        lore: formData.lore.filter((item) => item.trim() !== ''),
        objectives: formData.objectives.filter((item) => item.trim() !== ''),
        knowledge: formData.knowledge.filter((item) => item.trim() !== ''),
        interval: formData.interval * 1000,
        chat_id: uuidv4(),
        external_plugins,
        internal_plugins,
        memory: formData.memory,
        autonomous: formData.autonomous,
      };

      const response = await invoke('submit_agent_config', { agentConfig: agentConfig });
      console.log('response', response);
      // const config_hash = getJsonHash(agentConfig, ["chat_id"]);
      // const { data: existingAgent } = await supabase
      //   .from("agents")
      //   .select("id")
      //   .eq("id", config_hash)
      //   .maybeSingle();

      // if (existingAgent) {
      //   setIsExisting(true);
      //   setConfigId(config_hash);
      //   setCurrentStep(steps.length);
      // } else {
      //   setIsExisting(false);
      //   const { error } = await supabase.from("agents").insert({
      //     id: config_hash,
      //     config: agentConfig,
      //   });
      //   if (error) throw error;
      //   setConfigId(config_hash);
      //   setCurrentStep(steps.length);
      // }

      console.log('Agent configuration saved:', agentConfig);
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to create agent. Please try again.',
        duration: 3000,
      });
    }
  };

  if (currentStep === steps.length && configId) {
    return (
      <div className="flex h-[400px] w-full max-w-2xl flex-col rounded-lg border border-neutral-800 bg-neutral-900 shadow-lg">
        <SuccessView configId={configId} onReset={resetForm} isExisting={isExisting} />
      </div>
    );
  }

  return (
    <StyledAgentForm
      currentStep={currentStep}
      steps={steps}
      onNext={handleNext}
      onBack={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
      onSubmit={handleSubmit}
    >
      {steps[currentStep].component}
    </StyledAgentForm>
  );
};

export default AgentForm;
