import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function ButterflyCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  let particleId = 0;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Add a particle trail occasionally
      if (Math.random() > 0.7) {
        setParticles((prev) => [
          ...prev,
          { id: particleId++, x: e.clientX, y: e.clientY }
        ]);
        
        // Keep only the last 15 particles
        setParticles((prev) => prev.slice(-15));
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ 
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.05s linear'
        }}
      >
        {/* Glowing Butterfly */}
        <motion.div
          animate={{
            rotateY: [0, 60, 0, -60, 0],
            y: [0, -3, 0, 3, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-2xl drop-shadow-[0_0_8px_rgba(200,162,200,0.8)] ml-[-12px] mt-[-12px]"
        >
          🦋
        </motion.div>
      </div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 0.5, x: p.x, y: p.y }}
            animate={{ 
              opacity: 0,
              scale: 0,
              x: p.x + (Math.random() * 40 - 20),
              y: p.y + (Math.random() * 40 - 10)
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_#fff,0_0_10px_#c8a2c8] pointer-events-none z-[9998]"
            style={{ marginLeft: '-3px', marginTop: '-3px' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
