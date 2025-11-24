import React, { useState } from 'react';
import { Layers, Box, Cpu, Grid, Zap } from 'lucide-react';
import { GpuComponent } from '../types';

interface Props {
  onSelectComponent: (name: string, description: string) => void;
}

const components: GpuComponent[] = [
  { id: 'host-interface', name: 'PCIe 接口', details: '连接 GPU 与 CPU/主板的数据通道。', gridArea: 'col-span-12 h-12' },
  { id: 'command-processor', name: 'GigaThread 引擎', details: '向流式多处理器 (SM) 分配工作块。', gridArea: 'col-span-12 md:col-span-4 h-24' },
  { id: 'l2-cache', name: 'L2 缓存', details: '所有 SM 共享的高速内存。', gridArea: 'col-span-12 md:col-span-8 h-24' },
  { id: 'sm-1', name: '流式多处理器 (SM)', details: 'GPU 的核心。包含 CUDA 核心、Tensor 核心和 RT 核心。', gridArea: 'col-span-6 md:col-span-3 h-40' },
  { id: 'sm-2', name: '流式多处理器 (SM)', details: '用于并行处理的额外 SM 模块。', gridArea: 'col-span-6 md:col-span-3 h-40' },
  { id: 'sm-3', name: '流式多处理器 (SM)', details: '用于并行处理的额外 SM 模块。', gridArea: 'col-span-6 md:col-span-3 h-40' },
  { id: 'sm-4', name: '流式多处理器 (SM)', details: '用于并行处理的额外 SM 模块。', gridArea: 'col-span-6 md:col-span-3 h-40' },
  { id: 'vram', name: '显存 (VRAM GDDR6X)', details: '高速全局视频内存，存储纹理和帧缓冲。', gridArea: 'col-span-12 h-16' },
];

const ArchitectureDiagram: React.FC<Props> = ({ onSelectComponent }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="p-4 bg-gpu-panel rounded-xl border border-gpu-accent shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="text-gpu-green" /> 芯片布局
        </h2>
        <span className="text-xs text-gray-500">交互式框图</span>
      </div>

      <div className="grid grid-cols-12 gap-2 relative">
        {components.map((comp) => (
          <div
            key={comp.id}
            className={`${comp.gridArea} relative group cursor-pointer transition-all duration-300
              ${hovered === comp.id ? 'bg-gpu-green/20 border-gpu-green' : 'bg-gray-800/50 border-gray-700'}
              border-2 rounded-lg flex flex-col items-center justify-center p-2 text-center overflow-hidden
            `}
            onMouseEnter={() => setHovered(comp.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelectComponent(comp.name, comp.details)}
          >
            {/* Visual fluff inside the blocks */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 grid-rows-4 gap-px">
                {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className="bg-white/20"></div>
                ))}
            </div>
            
            <span className={`text-sm md:text-base font-bold z-10 ${hovered === comp.id ? 'text-gpu-green' : 'text-gray-300'}`}>
              {comp.name}
            </span>
            {comp.id.includes('sm') && (
               <div className="mt-2 flex gap-1 z-10">
                 <Grid size={12} className="text-blue-400" />
                 <Zap size={12} className="text-yellow-400" />
                 <Box size={12} className="text-purple-400" />
               </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-gray-800 text-xs text-gray-400">
        <p>提示：点击任意架构模块，让 AI 助手为您深入讲解。</p>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;