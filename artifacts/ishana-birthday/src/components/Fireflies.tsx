import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export default function Fireflies() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
    }));
    setFireflies(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10]">
      {fireflies.map((ff) => (
        <motion.div
          key={ff.id}
          initial={{ 
            x: `${ff.x}vw`, 
            y: `${ff.y}vh`, 
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: [`${ff.x}vw`, `${ff.x + (Math.random() * 10 - 5)}vw`, `${ff.x}vw`],
            y: [`${ff.y}vh`, `${ff.y + (Math.random() * 10 - 5)}vh`, `${ff.y}vh`],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: ff.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-[#fffbdf] shadow-[0_0_8px_#fffbdf,0_0_15px_#ffd700]"
          style={{ 
            width: ff.size, 
            height: ff.size,
          }}
        />
      ))}
    </div>
  );
}
