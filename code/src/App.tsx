import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainPage from './components/MainPage';
import ChatInterface from './components/ChatInterface';
import Journal from './components/Journal';

function App() {
  const [page, setPage] = useState<'main' | 'chat' | 'journal'>('main');

  // 切换到聊天页
  const handleEnterChat = () => {
    setPage('chat');
  };

  // 切换到日记页
  const handleEnterJournal = () => {
    setPage('journal');
  };

  // 返回主页面
  const handleBackToMain = () => {
    setPage('main');
  };

  // 渲染主页面
  if (page === 'main') {
    return <MainPage onEnterChat={handleEnterChat} onEnterJournal={handleEnterJournal} />;
  }

  // 渲染聊天或日记页面
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        <main className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {page === 'chat' ? (
              <ChatInterface onBack={handleBackToMain} />
            ) : (
              <Journal onBack={handleBackToMain} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;