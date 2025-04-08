"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

const AiAgentTerminal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [speed, setSpeed] = useState(1);

  const spinnerFrames = useMemo(
    () => ["⠈", "⠐", "⠠", "⢀", "⡀", "⠄", "⠂", "⠁"],
    [],
  );

  const steps = useMemo(
    () => [
      { text: "$ pnpm run start", delay: 1000 / speed, loading: true },
      {
        text: `   _____             __  
  / ___/____  ____ _/ /__
  \\__ \\/ __ \\/ __ \`/ //_/
 ___/ / / / / /_/ / ,<   
/____/_/ /_/\\__,_/_/|_|  
v0.0.11 by Kasar`,
        delay: 1200 / speed,
        loading: false,
        highlight: true,
        sentHighlight: true,
      },
      {
        text: "✔ Agent initialized successfully",
        delay: 800 / speed,
        loading: false,
        success: true,
      },
      {
        text: `=== AGENT CONFIGURATION ===`,
        delay: 700 / speed,
        loading: false,
      },
      {
        text: `┌──────────────────────────────────────────────────┐
│ IDENTITY                                         │
├──────────────────────────────────────────────────┤
│ Name: Snak Guide Agent                           │
│ Mode: Autonomous                                 │
└──────────────────────────────────────────────────┘`,
        delay: 1000 / speed,
        loading: false,
        box: true,
      },
      {
        text: `┌──────────────────────────────────────────────────┐
│ OBJECTIVES                                       │
├──────────────────────────────────────────────────┤
│ • Guide users through Starknet Agent Kit         │
│ • Demonstrate blockchain interactions            │
│ • Explain plugins capabilities                   │
└──────────────────────────────────────────────────┘`,
        delay: 1000 / speed,
        loading: false,
        box: true,
      },
      {
        text: "Starting interactive session...",
        delay: 800 / speed,
        loading: true,
      },
      {
        text: "[SYS] Agent status: OPERATIONAL",
        delay: 800 / speed,
        loading: false,
      },
      {
        text: "[SYS] Autonomous mode: ACTIVE",
        delay: 700 / speed,
        loading: false,
      },
      {
        text: "[NET] Connecting to Starknet",
        delay: 900 / speed,
        loading: true,
      },
      {
        text: "[NET] Connected: SN_MAIN",
        delay: 800 / speed,
        loading: false,
      },
      {
        text: "[AI] Processing blockchain data",
        delay: 1200 / speed,
        loading: true,
      },
      {
        text: "[AI] Analyzing network activity",
        delay: 1100 / speed,
        loading: true,
      },
      {
        text: "[AI] Scanning for opportunities",
        delay: 1000 / speed,
        loading: true,
      },
      {
        text: `[DATA] Network Analysis:
{
  "status": "ACTIVE",
  "tps": "42.3",
  "block_time": "1.5s",
  "gas_price": "0.00021 ETH"
}`,
        delay: 1500 / speed,
        loading: false,
        code: true,
      },
      {
        text: "[AI] Opportunity identified",
        delay: 900 / speed,
        loading: false,
      },
      {
        text: `[TOKEN] Token Analysis:
{
  "symbol": "EKB",
  "price": "$1.24",
  "24h_change": "+8.2%",
  "7d_change": "+14.5%",
  "volume_24h": "$12.8M",
  "market_cap": "$30M",
  "risk_level": "MEDIUM"
}`,
        delay: 1600 / speed,
        loading: false,
        code: true,
      },
      {
        text: "[SEC] Validating contract security",
        delay: 1100 / speed,
        loading: true,
      },
      {
        text: "[SEC] Security verification complete",
        delay: 900 / speed,
        loading: false,
      },
      {
        text: "[EXEC] Optimizing execution parameters",
        delay: 1000 / speed,
        loading: true,
      },
      {
        text: "[EXEC] Preparing transaction",
        delay: 800 / speed,
        loading: true,
      },
      {
        text: `[TX] Transaction details:
0x7da3ae0b687f45a56079b58d3e8abc841d0326e14783f65b346a19f9d965741d`,
        delay: 1200 / speed,
        loading: false,
        code: true,
      },
      {
        text: `[STATUS] Transaction status:
{
  "status": "CONFIRMED",
  "block": "14392651",
  "gas_used": "142,387",
  "time": "0.8s"
}`,
        delay: 1300 / speed,
        loading: false,
        code: true,
      },
      {
        text: "[PORTFOLIO] Position successfully opened",
        delay: 900 / speed,
        loading: false,
      },
      {
        text: "[MONITOR] Setting price alerts",
        delay: 800 / speed,
        loading: true,
      },
      {
        text: "[MONITOR] Position tracking active",
        delay: 900 / speed,
        loading: false,
      },
      {
        text: "[SYS] Scanning for next opportunity",
        delay: 1200 / speed,
        loading: true,
      },
    ],
    [speed],
  );

  // Spinner animation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      interval = setInterval(() => {
        setSpinnerFrame((prev) => (prev + 1) % spinnerFrames.length);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [spinnerFrames, isLoading]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [text]);

  // Terminal text animation
  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      setIsLoading(step.loading);

      const timeout = setTimeout(() => {
        setText((prev) => {
          const newText = `${prev}${prev ? "\n" : ""}${step.text}`;
          return newText;
        });
        setCurrentStep((prev) => prev + 1);
      }, step.delay);

      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, [currentStep, steps]);

  // Format text with AI styling
  interface FormatOptions {
    highlight?: boolean;
    code?: boolean;
    success?: boolean;
    box?: boolean;
    sentHighlight?: boolean;
  }

  const formatLine = (text: string, options: FormatOptions = {}) => {
    const { highlight, code, success, box, sentHighlight } = options;

    if (sentHighlight)
      return <span className="text-purple-400 font-mono">{text}</span>;
    if (highlight)
      return <span className="text-blue-400 font-mono">{text}</span>;
    if (success) return <span className="text-green-400">{text}</span>;
    if (box) return <pre className="text-gray-300">{text}</pre>;
    if (code) {
      const lines = text.split("\n");
      const firstLine = lines[0];
      const restLines = lines.slice(1).join("\n");

      return (
        <div>
          <span className="font-bold">{firstLine}</span>
          <pre className="bg-black-900 bg-opacity-40 px-2 py-1 mt-1 rounded text-gray-300 font-mono">
            {restLines}
          </pre>
        </div>
      );
    }

    // Find the first bracket closing position to style only the prefix
    const closingBracketPos = text.indexOf("]");
    if (closingBracketPos === -1) return <span>{text}</span>;

    return (
      <span>
        <span className="font-bold">
          {text.substring(0, closingBracketPos + 1)}
        </span>
        <span>{text.substring(closingBracketPos + 1)}</span>
      </span>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[650px] bg-black rounded-lg shadow-lg border border-gray-800 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center p-2 bg-black-900 border-b border-gray-800">
          <div className="flex space-x-1.5 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
          </div>
          <div className="text-xs text-gray-400">Snak v0.0.11</div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="font-mono text-xs p-4 h-[360px] overflow-y-auto text-gray-300"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4A5568 #000",
          }}
        >
          <div className="whitespace-pre-wrap break-words">
            {steps.slice(0, currentStep).map((step, index) => {
              const isLastLoadingStep =
                index === currentStep - 1 && step.loading && isLoading;

              return (
                <div key={index} className="mb-2">
                  {isLastLoadingStep && (
                    <span className="mr-2">{spinnerFrames[spinnerFrame]}</span>
                  )}
                  {formatLine(step.text, {
                    highlight: step.highlight,
                    code: step.code,
                    success: step.success,
                    box: step.box,
                    sentHighlight: step.sentHighlight,
                  })}
                </div>
              );
            })}
            {!isLoading && showCursor && (
              <span className="ml-1 animate-blink">_</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 bg-black-900 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
          {/* <div className="flex items-center space-x-1">
            <button onClick={() => setSpeed(0.5)} className={`px-2 py-1 rounded text-xs ${speed === 0.5 ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-gray-400"}`}>0.5x</button>
            <button onClick={() => setSpeed(1)} className={`px-2 py-1 rounded text-xs ${speed === 1 ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-gray-400"}`}>1x</button>
            <button onClick={() => setSpeed(2)} className={`px-2 py-1 rounded text-xs ${speed === 2 ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-gray-400"}`}>2x</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AiAgentTerminal;
