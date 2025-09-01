import React from 'react';
import Icon from './Icon.tsx';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = [
  '🛍️', '💼', '🍳', '💊', '🔁', '🎮', '🍔', '💆‍♀️', '🏠', '🧾', '🚗', '📁', '💰', '🏗️', '📈',
  '✈️', '🎁', '🛒', '👕', '👠', '📱', '💻', '💡', '☕️', '🍺', '🎬', '🎵', '🏋️‍♂️', '🏥', '⛽️',
  '📚', '🎓', '🎨', '💸', '💳', '💡', '🎉', '🐶', '🐱', '🌿'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Pilih Emoji</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="text-3xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-accent"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;