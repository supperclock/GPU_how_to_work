import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Grid3X3 } from 'lucide-react';

const CpuVsGpuDemo: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [cpuProgress, setCpuProgress] = useState(0);
  const [gpuProgress, setGpuProgress] = useState<number[]>(new Array(64).fill(0));
  
  // Simulation constants
  const TASK_COUNT = 64;
  const CPU_SPEED = 20; // Fast per task
  const GPU_SPEED = 0.5; // Slow per task, but parallel

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCpuProgress(0);
    setGpuProgress(new Array(64).fill(0));

    // CPU Logic: Serial Processing
    let currentCpuTask = 0;
    const cpuInterval = setInterval(() => {
      setCpuProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
            currentCpuTask++;
            if(currentCpuTask >= TASK_COUNT) {
                 clearInterval(cpuInterval);
                 return 100; // Done
            }
            return 0; // Reset for next task
        }
        return next;
      });
    }, 1000 / (CPU_SPEED * 60)); // Normalize roughly

    // GPU Logic: Parallel Processing
    const gpuInterval = setInterval(() => {
        setGpuProgress(prev => {
            const next = prev.map(p => Math.min(100, p + GPU_SPEED + Math.random()));
            if (next.every(p => p >= 100)) {
                clearInterval(gpuInterval);
            }
            return next;
        });
    }, 16); // 60fps

    // Cleanup logic
    const checkDone = setInterval(() => {
        // Just a simple timeout to stop simulation status for UI
        // In a real app we'd track completion state better
    }, 1000);
    
    setTimeout(() => {
        setIsSimulating(false);
        clearInterval(cpuInterval);
        clearInterval(gpuInterval);
        clearInterval(checkDone);
        setCpuProgress(100);
        setGpuProgress(new Array(64).fill(100));
    }, 8000); // Hard stop after 8s
  };

  return (
    <div className="bg-gpu-panel rounded-xl border border-gpu-accent p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-xl font-bold text-white">并行处理: CPU vs GPU</h2>
            <p className="text-gray-400 text-sm">串行执行 vs 大规模并行</p>
        </div>
        <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2 bg-gpu-green text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            {isSimulating ? '处理中...' : '开始模拟'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CPU Visualization */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
            <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold">
                <Zap size={20} />
                <h3>CPU (低延迟优化)</h3>
            </div>
            <div className="relative h-64 border border-gray-800 bg-black rounded p-2 flex flex-wrap content-start gap-1 overflow-hidden">
                 {/* Represents the single fast core processing tasks one by one */}
                 {Array.from({ length: 64 }).map((_, i) => {
                     // Determine if this task is done, processing, or waiting
                     // CPU completes tasks 0, then 1, then 2...
                     // We only have one progress bar for the "current" task really
                     // Visualizing historical completion
                     // This is a simplification for visual effect
                     const cpuTaskCompletion = Math.floor((isSimulating ? Date.now() : 0) / 100); // Dummy logic for static render
                     
                     // Use state for rendering
                     const isDone = (isSimulating && cpuProgress === 100) || (!isSimulating && cpuProgress === 100); 
                     // Simple visual: Fill the grid one by one
                     
                     // Let's use a simpler visual for CPU: Single Bar moving fast repeatedly
                     return null; 
                 })}
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="text-4xl font-mono text-blue-500 mb-2">{isSimulating ? '1' : '0'} 核心</div>
                    <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-75" style={{ width: `${cpuProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">正在按顺序处理任务...</p>
                 </div>
            </div>
        </div>

        {/* GPU Visualization */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
             <div className="flex items-center gap-2 mb-4 text-gpu-green font-bold">
                <Grid3X3 size={20} />
                <h3>GPU (高吞吐量优化)</h3>
            </div>
            <div className="h-64 border border-gray-800 bg-black rounded p-2 grid grid-cols-8 gap-1">
                {gpuProgress.map((prog, i) => (
                    <div key={i} className="bg-gray-800 rounded-sm relative overflow-hidden group">
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-gpu-green transition-all duration-300 ease-out"
                            style={{ height: `${prog}%` }}
                        ></div>
                        {/* Tooltipish effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white"></div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">64 个任务同时处理中</p>
        </div>
      </div>
    </div>
  );
};

export default CpuVsGpuDemo;