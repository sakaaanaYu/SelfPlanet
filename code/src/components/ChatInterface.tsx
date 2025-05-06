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

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callDeepSeekAPI = async (userMessage: string) => {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个温暖、富有同理心的AI疗愈助手。请用温和、支持性的语气与用户交流，帮助他们缓解压力、疏导情绪。',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('API 调用失败');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API 调用错误:', error);
      return '抱歉，我现在无法回应。请稍后再试。';
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage = inputText.trim();
      setInputText('');
      setIsLoading(true);

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: userMessage, sender: 'user', timestamp: new Date() },
      ]);

      try {
        const aiResponse = await callDeepSeekAPI(userMessage);

        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: aiResponse, sender: 'ai', timestamp: new Date() },
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
          <span className="text-base font-semibold text-gray-700">和Ta聊天</span>
        </div>
        <div style={{ width: 40 }} /> {/* 占位 */}
      </div>

      {/* AI 角色形象区域 */}
      <div className="h-1/2 flex items-center justify-center bg-gradient-to-b from-primary-50 to-transparent">
        <div className="relative w-96 h-96">
          <img
            src="/小怪兽立绘.png"
            alt="AI 角色"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/384x384?text=AI+角色';
            }}
          />
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="h-full flex flex-col justify-end">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200 bg-white">
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