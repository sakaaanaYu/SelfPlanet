import React from 'react';
import { ChatBubbleLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  activeTab: 'chat' | 'journal';
  setActiveTab: (tab: 'chat' | 'journal') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
      <div className="flex justify-center space-x-8">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'chat'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>AI 对话</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'journal'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpenIcon className="h-5 w-5" />
          <span>心情日记</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 