import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack?: () => void;
}

// 预设回复
const PRESET_RESPONSES: { [key: string]: string } = {
  "你好": `你好，我是你的AI小怪兽。生活中有时会遇到压力和情绪波动，这都是很正常的。

我在这里，会用心倾听你说的每一句话。如果你愿意，可以和我聊聊最近发生了什么，或者此刻你内心的感受是怎样的？`,
  
  "我今天有点伤心，感觉压力有点大": `听到你正在经历这些感受，我真的很心疼。能感受到伤心和压力，说明你是个对自己很诚实的人呢。这些情绪确实会让人感到沉重，你愿意和我多说一些吗？

我注意到你用了"有点"来形容自己的状态，这种细微的表达让我感受到你是个很体贴自己的人。也许此刻，我们可以一起做几次深呼吸？吸气...呼气...对，就是这样。

你愿意告诉我，是什么样的压力让你感到特别困扰吗？或者只是需要有人安静地陪着你？无论哪种方式，我都会在这里，像陪伴朋友一样陪着你。记住，所有的情绪都是暂时的，而你的感受永远值得被重视。`
};

// 格式化消息文本（处理段落间距）
const formatMessage = (text: string) => {
  return text.split('\n\n').map((paragraph, index) => (
    <React.Fragment key={index}>
      <div className="mb-4">{paragraph}</div>
      {index < text.split('\n\n').length - 1 && <div className="h-4" />}
    </React.Fragment>
  ));
};

// 消息气泡组件
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
  <div
    className={`flex ${
      message.sender === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        message.sender === 'user'
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {message.sender === 'user' ? message.text : formatMessage(message.text)}
    </div>
  </div>
);

// 加载动画组件
const LoadingIndicator: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 获取AI回复
  const getAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // 检查是否有预设回复
    if (PRESET_RESPONSES[userMessage]) {
      return PRESET_RESPONSES[userMessage];
    }

    // 调用API获取回复
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1",
          messages: [
            {
              role: "system",
              content: "你是一个温暖、富有同理心的AI疗愈助手。请用温和、支持性的语气与用户交流，帮助他们缓解压力、疏导情绪。"
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          stream: true,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error('API 调用失败');
      }

      return await response.text();
    } catch (error) {
      console.error('API 调用错误:', error);
      return '抱歉，我现在无法回应。请稍后再试。';
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage = inputText.trim();
      setInputText('');
      setIsLoading(true);

      // 添加用户消息
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: userMessage, sender: 'user', timestamp: new Date() }
      ]);

      try {
        const aiResponse = await getAIResponse(userMessage);
        
        // 添加AI回复
        setMessages(prev => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: aiResponse, sender: 'ai', timestamp: new Date() }
        ]);
      } catch (error) {
        console.error('发送消息错误:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-transparent">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <div className="flex-1 text-center -ml-8">
          <span className="text-base font-semibold text-gray-700">聊愈</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* AI 角色形象区域 */}
      <div className="h-1/3 flex items-center justify-center bg-gradient-to-b from-primary-50 to-transparent">
        <div className="relative w-48 h-48">
          <img
            src="/小怪兽立绘.png"
            alt="AI 角色"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192x192?text=AI+角色';
            }}
          />
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入你的想法..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`bg-primary-500 text-white p-3 rounded-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
            }`}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;