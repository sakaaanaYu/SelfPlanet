import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import Journal from './components/Journal';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';

function App() {
  const [page, setPage] = useState<'main' | 'chat' | 'journal'>('main');
  const [activeTab, setActiveTab] = useState<'chat' | 'journal'>('chat');

  // 切换到聊天页
  const handleEnterChat = () => {
    setPage('chat');
    setActiveTab('chat');
  };
  // 切换到日记页
  const handleEnterJournal = () => {
    setPage('journal');
    setActiveTab('journal');
  };
  // 返回主页面
  const handleBackToMain = () => {
    setPage('main');
  };

  if (page === 'main') {
    return <MainPage onEnterChat={handleEnterChat} onEnterJournal={handleEnterJournal} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* 聊天或日记页面不再显示 Navbar */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {activeTab === 'chat' ? <ChatInterface onBack={handleBackToMain} /> : <Journal onBack={handleBackToMain} />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App; 