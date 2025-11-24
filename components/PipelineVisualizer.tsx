import React, { useState, useEffect } from 'react';
import { Box, Play, Pause, RefreshCw, Triangle, Grid3X3, Monitor, Paintbrush } from 'lucide-react';
import { PipelineStage } from '../types';

const stages: PipelineStage[] = [
  { id: 'vertex', name: '输入装配与顶点着色器', description: '读取顶点数据，并将其从 3D 对象空间变换为 2D 屏幕空间。', icon: 'Triangle' },
  { id: 'raster', name: '光栅化', description: '将矢量形状（三角形）转换为潜在的像素（片段）。', icon: 'Grid3X3' },
  { id: 'fragment', name: '片段着色器', description: '根据纹理、光照和阴影计算每个像素的最终颜色。', icon: 'Paintbrush' },
  { id: 'output', name: '输出合并', description: '合并片段，处理深度测试 (Z-buffer)，并将结果写入帧缓冲区。', icon: 'Monitor' },
];

interface Props {
  onExplainStage: (stageName: string, description: string) => void;
}

const PipelineVisualizer: React.FC<Props> = ({ onExplainStage }) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % stages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStepClick = (index: number) => {
    setActiveStage(index);
    setIsRunning(false);
    onExplainStage(stages[index].name, stages[index].description);
  };

  const renderIcon = (iconName: string, isActive: boolean) => {
    const className = `w-6 h-6 ${isActive ? 'text-black' : 'text-gpu-green'}`;
    switch(iconName) {
        case 'Triangle': return <Triangle className={className} />;
        case 'Grid3X3': return <Grid3X3 className={className} />;
        case 'Paintbrush': return <Paintbrush className={className} />;
        case 'Monitor': return <Monitor className={className} />;
        default: return <Box className={className} />;
    }
  };

  return (
    <div className="bg-gpu-panel rounded-xl border border-gpu-accent p-6 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">图形渲染管线</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-full hover:bg-white/10 transition ${isRunning ? 'text-red-400' : 'text-gpu-green'}`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button 
            onClick={() => { setIsRunning(false); setActiveStage(0); }}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 relative">
        {stages.map((stage, index) => {
          const isActive = index === activeStage;
          return (
            <div 
              key={stage.id} 
              className={`
                flex-1 relative border-2 rounded-xl p-4 transition-all duration-500 cursor-pointer
                flex flex-col items-center justify-center gap-3 text-center
                ${isActive 
                  ? 'border-gpu-green bg-gpu-green text-black scale-105 z-10 shadow-[0_0_20px_rgba(0,255,65,0.3)]' 
                  : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500'}
              `}
              onClick={() => handleStepClick(index)}
            >
              {renderIcon(stage.icon, isActive)}
              <h3 className="font-bold text-sm">{stage.name}</h3>
              
              {/* Data Flow Indicator */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-0">
                   <div className={`w-8 h-1 ${index === activeStage ? 'bg-gpu-green animate-pulse' : 'bg-gray-800'}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-black/40 border border-gray-700 rounded-lg">
        <h4 className="text-gpu-green font-bold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-gpu-green rounded-full animate-pulse"></span>
            当前操作: {stages[activeStage].name}
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
            {stages[activeStage].description}
        </p>
      </div>
    </div>
  );
};

export default PipelineVisualizer;