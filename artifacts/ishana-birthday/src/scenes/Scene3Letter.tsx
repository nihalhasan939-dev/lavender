import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import lavenderGarden from '@assets/Lavender_aesthetic.png_2K_202607061551_1783333605481.jpeg';

const letterText = `Dear Ishana,

Happy birthday Ishana... 😁💕

Happy birthday to the person who feels like a warm cup of tea on a rainy day.... 😁💯

Happy 15th birthday to my amazing sister and wonderful friend... 😁💕💕💯

You are truly like a hidden pocket of sunshine, and you make life so much sweeter just by being yourself... 💕😁💞

I hope your special day is completely cozy, stress-free, and filled with your absolute favorite things 😉😁

Cheers to more laughs, shared secrets, and another beautiful year of being the awesome person you are... 💯😁😉💕

I made this little adventure just for you 😅💕 hope this makes you smile... 😁

Few things are remaining in this gift, go for it and try to choose option 'No' and see what happens.. 😉

With love,
Your Friend 🌸`;

export default function Scene3Letter({ onComplete }: { onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (isOpen && displayedText.length < letterText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(letterText.slice(0, displayedText.length + 1));
      }, 35);
      return () => clearTimeout(timeout);
    } else if (isOpen && displayedText.length === letterText.length) {
      setIsTypingComplete(true);
      return undefined;
    }
    return undefined;
  }, [isOpen, displayedText]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${lavenderGarden})` }}
      />
      <div className="absolute inset-0 bg-[#2a0845]/40 z-0 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-lg px-4 perspective-[1000px] flex flex-col items-center justify-center h-full">
        
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              exit={{ opacity: 0, rotateX: 90, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="relative cursor-none interactive-button group"
              onClick={() => setIsOpen(true)}
            >
              {/* Envelope Body */}
              <div className="w-[300px] md:w-[400px] h-[200px] md:h-[260px] bg-[#fdfbf7] rounded-md shadow-2xl relative overflow-hidden border border-[#e8d5f0]">
                {/* Envelope Flaps (CSS triangles) */}
                <div className="absolute top-0 left-0 border-t-[100px] md:border-t-[130px] border-l-[150px] md:border-l-[200px] border-r-[150px] md:border-r-[200px] border-b-[100px] md:border-b-[130px] border-t-[#ebd8f2] border-l-[#f4e6f7] border-r-[#f4e6f7] border-b-[#fdfbf7]" />
                
                {/* Wax Seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full shadow-inner flex items-center justify-center border-2 border-primary/80">
                  <span className="text-white font-script text-xl font-bold">I</span>
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-12 w-full text-center text-white font-serif tracking-wide shadow-black drop-shadow-md"
              >
                Click to open
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, rotateX: -90, y: 100 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.5, type: 'spring' }}
              className="w-[95%] max-w-[500px] bg-[#fffaf5] text-[#3e2723] rounded-sm relative flex flex-col"
              style={{
                maxHeight: 'calc(100dvh - 80px)',
                boxShadow: 'inset 0 0 20px rgba(123,45,139,0.05), 0 10px 40px rgba(0,0,0,0.3)'
              }}
            >
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

              {/* Scrollable letter body */}
              <div
                className="overflow-y-auto flex-1 p-8 md:p-12"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8d5f0 31px, #e8d5f0 32px)',
                  backgroundAttachment: 'local',
                }}
              >
                <div className="font-serif text-lg leading-8 whitespace-pre-wrap">
                  {displayedText}
                  {!isTypingComplete && <span className="animate-pulse">|</span>}
                </div>
              </div>

              <AnimatePresence>
                {isTypingComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="px-8 md:px-12 py-4 flex justify-end border-t border-[#e8d5f0] bg-[#fffaf5] rounded-b-sm"
                  >
                    <button
                      onClick={onComplete}
                      className="interactive-button px-6 py-2 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-colors border border-primary/20"
                    >
                      Next →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
