import React, { useState } from 'react';
import { FaceSmileIcon, FaceFrownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface JournalEntry {
  id: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  timestamp: Date;
}

interface JournalProps {
  onBack?: () => void;
}

const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');

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
          <span className="text-base font-semibold text-gray-700">心情日记</span>
        </div>
        <div style={{ width: 40 }} /> {/* 占位 */}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">记录你的心情</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">今天的心情</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setMood('happy')}
                className={`p-2 rounded-full ${
                  mood === 'happy' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400'
                }`}
              >
                <FaceSmileIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => setMood('neutral')}
                className={`p-2 rounded-full ${
                  mood === 'neutral' ? 'bg-gray-100 text-gray-600' : 'text-gray-400'
                }`}
              >
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => setMood('sad')}
                className={`p-2 rounded-full ${
                  mood === 'sad' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <FaceFrownIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的想法..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            保存日记
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-2">
                {entry.mood === 'happy' && (
                  <FaceSmileIcon className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                {entry.mood === 'neutral' && (
                  <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                )}
                {entry.mood === 'sad' && (
                  <FaceFrownIcon className="h-5 w-5 text-blue-500 mr-2" />
                )}
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