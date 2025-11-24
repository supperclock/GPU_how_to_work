import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, X, ChevronRight } from 'lucide-react';
import { chatWithExpert, generateExplanation } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface Props {
  contextTopic: string | null;
  contextDescription: string | null;
}

const AIAssistant: React.FC<Props> = ({ contextTopic, contextDescription }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "欢迎来到 GPU Nexus。我已连接到神经网络。点击任何组件或管线阶段，我会为您详细解释！", timestamp: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-generate explanation when user selects something in the main UI
  useEffect(() => {
    if (contextTopic && contextDescription) {
      const fetchContextExp = async () => {
        setLoading(true);
        // Add a specialized "system" message from the UI selection
        const uiMessage: ChatMessage = {
          role: 'model',
          text: `**正在分析 ${contextTopic}...**\n\n思考中...`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, uiMessage]);

        const explanation = await generateExplanation(contextTopic, contextDescription);
        
        setMessages(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = explanation;
            return newHistory;
        });
        setLoading(false);
      };
      fetchContextExp();
    }
  }, [contextTopic, contextDescription]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Convert internal message format to history format for API
    const apiHistory = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await chatWithExpert(input, apiHistory);

    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gpu-green text-black p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 top-0 w-full md:w-96 bg-gray-950 border-l border-gray-800 shadow-2xl z-40 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sparkles className="text-gpu-green" size={18} />
            <h3 className="font-bold text-white">Gemini GPU 助手</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <ChevronRight size={24} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-gpu-green text-black rounded-tr-none' 
                  : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="markdown-body">
                   <ReactMarkdown 
                    components={{
                        code({node, inline, className, children, ...props}: any) {
                            return !inline ? (
                                <pre className="bg-black/50 p-2 rounded my-2 overflow-x-auto text-xs text-green-400">
                                    <code {...props}>{children}</code>
                                </pre>
                            ) : (
                                <code className="bg-black/30 px-1 rounded text-gpu-green" {...props}>{children}</code>
                            )
                        }
                    }}
                   >
                       {msg.text}
                   </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none border border-gray-700 flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="询问关于着色器、CUDA 或渲染的问题..."
                className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gpu-green placeholder-gray-600"
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="bg-gpu-accent hover:bg-gray-700 text-gpu-green p-2 rounded-lg transition disabled:opacity-50"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;