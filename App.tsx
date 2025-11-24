import React, { useState } from 'react';
import { Activity, Cpu, Layers, LayoutGrid, Info } from 'lucide-react';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import PipelineVisualizer from './components/PipelineVisualizer';
import CpuVsGpuDemo from './components/CpuVsGpuDemo';
import AIAssistant from './components/AIAssistant';
import { ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.ARCHITECTURE);
  const [contextTopic, setContextTopic] = useState<string | null>(null);
  const [contextDesc, setContextDesc] = useState<string | null>(null);

  const handleTopicSelection = (topic: string, description: string) => {
    setContextTopic(topic);
    setContextDesc(description);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-black/80 backdrop-blur flex items-center px-6 justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gpu-green rounded flex items-center justify-center text-black font-bold">
            <LayoutGrid size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">GPU <span className="text-gpu-green">核心</span>架构</h1>
        </div>
        <nav className="hidden md:flex gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button 
                onClick={() => setView(ViewState.ARCHITECTURE)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === ViewState.ARCHITECTURE ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                架构图解
            </button>
            <button 
                onClick={() => setView(ViewState.PIPELINE)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === ViewState.PIPELINE ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                渲染管线
            </button>
            <button 
                onClick={() => setView(ViewState.PARALLELISM)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === ViewState.PARALLELISM ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                运行模拟
            </button>
        </nav>
        <div className="text-xs text-gray-500 font-mono">
           v1.0.0
        </div>
      </header>

      {/* Mobile Nav (Simple) */}
      <div className="md:hidden flex justify-around border-b border-gray-800 bg-gray-900/50 p-2">
          <button onClick={() => setView(ViewState.ARCHITECTURE)} className={`p-2 ${view === ViewState.ARCHITECTURE ? 'text-gpu-green' : 'text-gray-500'}`}><Cpu /></button>
          <button onClick={() => setView(ViewState.PIPELINE)} className={`p-2 ${view === ViewState.PIPELINE ? 'text-gpu-green' : 'text-gray-500'}`}><Layers /></button>
          <button onClick={() => setView(ViewState.PARALLELISM)} className={`p-2 ${view === ViewState.PARALLELISM ? 'text-gpu-green' : 'text-gray-500'}`}><Activity /></button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 md:pr-[400px]">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* View Switching Logic */}
            {view === ViewState.ARCHITECTURE && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">内部架构</h2>
                        <p className="text-gray-400">探索现代 GPU 的物理布局。将鼠标悬停在模块上，了解它们在大规模并行机器中的功能。</p>
                    </div>
                    <ArchitectureDiagram onSelectComponent={handleTopicSelection} />
                </div>
            )}

            {view === ViewState.PIPELINE && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">渲染管线</h2>
                        <p className="text-gray-400">跟踪从 3D 几何体到屏幕上 2D 像素的数据流。</p>
                    </div>
                    <PipelineVisualizer onExplainStage={handleTopicSelection} />
                </div>
            )}

             {view === ViewState.PARALLELISM && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">并行处理逻辑</h2>
                        <p className="text-gray-400">可视化为什么 GPU 在图形和 AI 负载上比 CPU 更快。</p>
                    </div>
                    <CpuVsGpuDemo />
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
               <div className="p-4 border border-gray-800 rounded bg-gray-900/30">
                  <div className="flex items-center gap-2 text-gpu-green mb-2"><Info size={16}/>你知道吗？</div>
                  <p className="text-sm text-gray-400">现代 GPU 拥有数千个小核心，而 CPU 只有少数几个功能强大的核心。</p>
               </div>
               <div className="p-4 border border-gray-800 rounded bg-gray-900/30">
                  <div className="flex items-center gap-2 text-purple-400 mb-2"><Info size={16}/>AI Tensor 核心</div>
                  <p className="text-sm text-gray-400">专用硬件单元可以在一个时钟周期内执行 4x4 矩阵乘法。</p>
               </div>
               <div className="p-4 border border-gray-800 rounded bg-gray-900/30">
                  <div className="flex items-center gap-2 text-blue-400 mb-2"><Info size={16}/>SIMT 架构</div>
                  <p className="text-sm text-gray-400">单指令多线程。一条指令可以同时控制 32 个线程（一个 Warp）。</p>
               </div>
            </div>

          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <AIAssistant contextTopic={contextTopic} contextDescription={contextDesc} />
      </main>
    </div>
  );
};

export default App;