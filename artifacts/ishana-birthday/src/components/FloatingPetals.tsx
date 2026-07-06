import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChime } from '../utils/audio';

interface Petal {
  id: number;
  startX: number;
  duration: number;
  delay: number;
  rotation: number;
  scale: number;
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [message, setMessage] = useState<{ id: number; text: string; x: number; y: number } | null>(null);

  const messages = [
    "You're amazing! 💜",
    "Have a magical day! ✨",
    "Keep smiling! 😊",
    "You are loved! 🌸",
    "Stay bright! 🌟"
  ];

  useEffect(() => {
    // Generate initial petals
    const initialPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    }));
    setPetals(initialPetals);
  }, []);

  const handlePetalClick = (e: React.MouseEvent, id: number) => {
    playChime();
    
    // Show message
    setMessage({
      id: Date.now(),
      text: messages[Math.floor(Math.random() * messages.length)],
      x: e.clientX,
      y: e.clientY - 20
    });

    // Remove the clicked petal
    setPetals(prev => prev.filter(p => p.id !== id));

    // Hide message after 2s
    setTimeout(() => setMessage(null), 2000);

    // Add a new petal after a delay
    setTimeout(() => {
      setPetals(prev => [
        ...prev,
        {
          id: Date.now(),
          startX: Math.random() * 100,
          duration: 15 + Math.random() * 20,
          delay: 0,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        }
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[40]">
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ 
              y: '-10vh', 
              x: `${petal.startX}vw`,
              rotate: petal.rotation,
              opacity: 0
            }}
            animate={{ 
              y: '110vh',
              x: [`${petal.startX}vw`, `${petal.startX - 5}vw`, `${petal.startX + 5}vw`, `${petal.startX}vw`],
              rotate: petal.rotation + 360,
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{ 
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            onClick={(e) => handlePetalClick(e, petal.id)}
            className="absolute w-4 h-6 rounded-[50%_0_50%_50%] bg-[#c8a2c8]/60 shadow-[0_0_10px_rgba(200,162,200,0.4)] pointer-events-auto cursor-none interactive-button hover:bg-[#e8d5f0]"
            style={{ transform: `scale(${petal.scale})` }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed pointer-events-none bg-white/90 text-primary px-3 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm z-[50]"
            style={{ left: message.x, top: message.y, transform: 'translate(-50%, -100%)' }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
