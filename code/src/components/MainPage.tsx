import React from 'react';

interface MainPageProps {
  onEnterChat: () => void;
  onEnterJournal: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onEnterChat, onEnterJournal }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <img src="/小怪兽立绘.png" alt="AI 角色" className="w-32 h-32 mb-4 object-contain" />
        <h1 className="text-2xl font-bold text-primary-700 mb-2">SelfPlanet 自留地</h1>
        <p className="text-gray-600 mb-6">探索你的内心宇宙</p>
        <div className="flex space-x-4">
          <button
            onClick={onEnterChat}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary-600 transition-colors"
          >
            开始聊愈
          </button>
          <button
            onClick={onEnterJournal}
            className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-500 transition-colors"
          >
            进入小天地
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 