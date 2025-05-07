import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JournalEntry {
  id: string;
  content: string;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
  timestamp: Date;
}

interface JournalProps {
  onBack?: () => void;
}

const moods: { value: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad', icon: string, color: string }[] = [
  { value: 'very-happy', icon: '😄', color: 'bg-yellow-400' },
  { value: 'happy', icon: '🙂', color: 'bg-yellow-300' },
  { value: 'neutral', icon: '😐', color: 'bg-gray-300' },
  { value: 'sad', icon: '🙁', color: 'bg-blue-300' },
  { value: 'very-sad', icon: '😢', color: 'bg-blue-400' }
];

const RADIUS = 60; // 圆盘半径(px)
const ICON_SIZE = 36; // icon大小(px)
const CONTAINER_SIZE = 176; // w-44 = 176px

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad'>('neutral');

  const selectedIndex = moods.findIndex(m => m.value === mood);
  const baseRotation = - (360 / moods.length) * selectedIndex;

  const handleSubmit = () => {
    if (content.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content,
        mood,
        timestamp: new Date(),
      };
      setEntries([newEntry, ...entries]);
      setContent('');
      setMood('neutral');
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
          <span className="text-base font-semibold text-gray-700">小天地</span>
        </div>
        <div style={{ width: 40 }} /> {/* 占位 */}
      </div>

      {/* 日记输入区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">记录你的心情</h2>

          {/* 心情选择转盘 */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">今天过得怎么样？</label>
            <div className="relative w-44 h-44 mx-auto mb-6">
              {/* 圆盘 */}
              <div
                className="absolute left-0 top-0 w-full h-full"
                style={{
                  transition: 'transform 0.5s cubic-bezier(0.2,0.8,0.2,1)',
                  transform: `rotate(${baseRotation}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                {moods.map((m, i) => {
                  const angle = (360 / moods.length) * i - 90; // -90度让第一个icon从正上方开始
                  const rad = (angle * Math.PI) / 180;
                  const center = CONTAINER_SIZE / 2;
                  const x = center + RADIUS * Math.cos(rad) - ICON_SIZE / 2;
                  const y = center + RADIUS * Math.sin(rad) - ICON_SIZE / 2;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`absolute flex items-center justify-center rounded-full shadow-lg
                        ${mood === m.value ? 'ring-4 ring-primary-400 scale-110 z-10' : ''}
                        ${m.color}
                      `}
                      style={{
                        left: x,
                        top: y,
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        fontSize: 22,
                        transition: 'all 0.3s',
                        transform: `rotate(${-baseRotation}deg)`
                      }}
                    >
                      {m.icon}
                    </button>
                  );
                })}
              </div>
              {/* 圆盘底部的高亮icon（选中态） */}
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full border-4 border-primary-400 bg-white text-3xl shadow-lg z-20">
                {moods[selectedIndex].icon}
              </div>
            </div>
          </div>

          {/* 日记输入框 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的想法..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
          />

          {/* 保存按钮 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            保存日记
          </button>
        </div>

        {/* 日记列表 */}
        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">
                  {moods.find(m => m.value === entry.mood)?.icon}
                </span>
                <span className="text-sm text-gray-500">
                  {entry.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800">{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;