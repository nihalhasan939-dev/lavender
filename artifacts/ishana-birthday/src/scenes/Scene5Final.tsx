import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import lavenderTree from '@assets/3940718421216742.png_2K_202607061551_1783333605480.jpeg';

const paragraphs = [
  "Happy Birthday, Ishana! 🎂",
  "Fifteen looks absolutely beautiful on you.",
  "May your year be filled with laughter, adventures, and all the purple things that make you smile ✨",
  "You deserve every wonderful thing this world has to offer.",
  "Stay magical. 💜"
];

export default function Scene5Final({ onRestart }: { onRestart: () => void }) {
  const [visibleParas, setVisibleParas] = useState<number>(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Reveal paragraphs one by one
    const sequence = async () => {
      for (let i = 0; i < paragraphs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVisibleParas(prev => prev + 1);
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowButton(true);
    };
    
    sequence();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Deep Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-screen"
        style={{ backgroundImage: `url(${lavenderTree})` }}
      />
      
      {/* Ethereal Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0033]/90 via-[#2a0845]/60 to-transparent z-0" />

      {/* Floating Glowing Orbs */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none mix-blend-screen"
          style={{
            background: i % 2 === 0 ? 'radial-gradient(circle, rgba(200,162,200,0.8) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)',
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Content */}
      <div className="z-10 w-[90%] max-w-2xl flex flex-col items-center justify-center text-center gap-8 px-4">
        {paragraphs.map((text, idx) => (
          <AnimatePresence key={idx}>
            {visibleParas > idx && (
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] ${
                  idx === 0 ? "font-script text-5xl md:text-6xl text-[#e8d5f0] mb-4" 
                  : idx === paragraphs.length - 1 ? "font-script text-4xl text-[#ffd700] mt-4" 
                  : "font-serif text-xl md:text-2xl leading-relaxed font-light"
                }`}
              >
                {text}
              </motion.p>
            )}
          </AnimatePresence>
        ))}

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              onClick={onRestart}
              className="interactive-button mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full font-sans tracking-wide text-sm backdrop-blur-md transition-all shadow-[0_0_20px_rgba(200,162,200,0.3)] hover:shadow-[0_0_30px_rgba(200,162,200,0.5)]"
            >
              Enjoy Your Gift 💜
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
