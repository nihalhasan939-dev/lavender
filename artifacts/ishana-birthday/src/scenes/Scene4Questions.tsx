import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChime } from '../utils/audio';

export default function Scene4Questions({ 
  onComplete,
  triggerConfetti
}: { 
  onComplete: () => void,
  triggerConfetti: () => void
}) {
  const [step, setStep] = useState(1);
  const [showSad, setShowSad] = useState(false);
  
  // For the escaping button
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (step !== 2) return;
    
    // Select the "No" button by an ID or assumption of its ref
    const noBtn = document.getElementById('escaping-no-btn');
    if (!noBtn || !containerRef.current) return;

    const btnRect = noBtn.getBoundingClientRect();
    const btnCenter = {
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top + btnRect.height / 2
    };

    const dist = Math.hypot(e.clientX - btnCenter.x, e.clientY - btnCenter.y);
    
    // If mouse gets within 80px, move it away
    if (dist < 80) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate new safe position within container boundaries
      const maxX = (containerRect.width / 2) - 60;
      const maxY = (containerRect.height / 2) - 30;
      
      const newX = (Math.random() * maxX * 2) - maxX;
      const newY = (Math.random() * maxY * 2) - maxY;
      
      setNoPosition({ x: newX, y: newY });
      playChime(); // Play a little sound when it escapes
    }
  };

  const handleYesQ1 = () => {
    triggerConfetti();
    setTimeout(() => setStep(2), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full bg-[#f4e6f7] flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* Background Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl text-primary/20 pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{ 
            y: [null, Math.random() * -100 - 50],
            rotate: 360
          }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
        >
          ✦
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="q1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="flex flex-col items-center z-10 bg-white/40 p-12 rounded-3xl backdrop-blur-md shadow-xl border border-white/50"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-10 text-center">
              Did you like my gift? 💜
            </h2>
            
            <div className="flex gap-6">
              <button 
                onClick={handleYesQ1}
                className="interactive-button px-8 py-4 bg-primary text-white rounded-full font-sans font-bold shadow-lg hover:scale-110 transition-transform"
              >
                Yes ❤️
              </button>
              
              {!showSad && (
                <button 
                  onClick={() => setShowSad(true)}
                  className="interactive-button px-8 py-4 bg-white text-gray-500 rounded-full font-sans font-bold shadow-md hover:bg-gray-50 transition-colors"
                >
                  No 💔
                </button>
              )}
            </div>

            <AnimatePresence>
              {showSad && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-8 flex flex-col items-center"
                >
                  <motion.div 
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-6xl mb-2"
                  >
                    🥺
                  </motion.div>
                  <p className="font-serif text-lg text-primary font-medium">
                    Pleeeease click Yes 👉👈
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="q2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center z-10 w-full max-w-lg relative h-64"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-12 text-center absolute top-0">
              One final message... <br/>Do you want to hear it? 🌟
            </h2>
            
            <div className="absolute top-24 flex gap-8">
              <button 
                onClick={() => {
                  triggerConfetti();
                  setTimeout(onComplete, 1000);
                }}
                className="interactive-button px-8 py-4 bg-primary text-white rounded-full font-sans font-bold shadow-lg hover:scale-110 transition-transform relative z-20"
              >
                Yes 😊
              </button>
              
              <motion.button 
                id="escaping-no-btn"
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="interactive-button px-8 py-4 bg-white text-gray-500 rounded-full font-sans font-bold shadow-md z-10 absolute left-[120px]" // Initial position offset from Yes button
              >
                No 😶
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
