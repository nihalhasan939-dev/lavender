import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChime } from '../utils/audio';

export default function HiddenGift() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            className="cursor-none text-2xl interactive-button"
            onClick={() => {
              playChime();
              setIsOpen(true);
            }}
          >
            🎁
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="glass p-4 rounded-xl shadow-lg max-w-[200px] text-center"
          >
            <p className="text-sm font-serif font-medium text-primary">
              You found the secret! 🌟 You're amazing Ishana!
            </p>
            <button 
              className="mt-3 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full interactive-button transition-colors"
              onClick={() => setVisible(false)}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
