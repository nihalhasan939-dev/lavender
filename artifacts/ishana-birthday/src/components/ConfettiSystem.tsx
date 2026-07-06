import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Shape = 'heart' | 'star' | 'petal';

interface Confetti {
  id: number;
  x: number;
  y: number;
  shape: Shape;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
}

const colors = ['#ffd700', '#c8a2c8', '#ff6b6b', '#4a0e8f', '#ffffff'];

export default function ConfettiSystem() {
  const [particles, setParticles] = useState<Confetti[]>([]);

  useEffect(() => {
    const generated: Confetti[] = [];
    for (let i = 0; i < 80; i++) {
      generated.push({
        id: i,
        x: 50, // Start from center roughly
        y: 50,
        shape: (['heart', 'star', 'petal'] as Shape[])[Math.floor(Math.random() * 3)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.4,
        delay: Math.random() * 0.2
      });
    }
    setParticles(generated);
  }, []);

  const getShape = (shape: Shape, color: string) => {
    switch (shape) {
      case 'heart':
        return <div className="text-xl" style={{ color }}>❤️</div>;
      case 'star':
        return <div className="text-xl" style={{ color }}>⭐</div>;
      case 'petal':
        return <div className="w-3 h-5 rounded-[50%_0_50%_50%]" style={{ backgroundColor: color }} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {particles.map((p) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 500 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance + 200; // Gravity effect

        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{ 
              x: tx, 
              y: ty, 
              opacity: 0, 
              scale: p.scale,
              rotate: p.rotation + 720
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              delay: p.delay,
              ease: [0.1, 0.8, 0.3, 1] // Custom ease out for explosion
            }}
            className="absolute"
          >
            {getShape(p.shape, p.color)}
          </motion.div>
        );
      })}
    </div>
  );
}
