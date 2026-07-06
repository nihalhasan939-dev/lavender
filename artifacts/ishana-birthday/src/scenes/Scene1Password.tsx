import { useState } from 'react';
import { motion } from 'framer-motion';
import lavenderTree from '@assets/3940718421216742.png_2K_202607061551_1783333605480.jpeg';

export default function Scene1Password({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'ishana15') {
      setSuccess(true);
      setTimeout(onComplete, 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${lavenderTree})` }}
      />
      <div className="absolute inset-0 bg-black/20 z-0 backdrop-blur-[2px]" />

      <motion.div 
        animate={
          success 
            ? { scale: 1.2, opacity: 0, filter: 'blur(10px)' }
            : error 
              ? { x: [-10, 10, -10, 10, 0] } 
              : { y: [0, -10, 0] }
        }
        transition={
          success 
            ? { duration: 1.5, ease: 'easeOut' }
            : error
              ? { duration: 0.4 }
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
        className="glass z-10 p-8 md:p-12 rounded-3xl w-[90%] max-w-md flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        {success && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 20 }} 
            transition={{ duration: 1.5, ease: 'easeIn' }}
            className="absolute inset-0 bg-white/50 rounded-full origin-center" 
          />
        )}

        <div className="text-4xl mb-6 text-primary/80 drop-shadow-md relative">
          <motion.div
            animate={success ? { rotate: [0, 360], scale: [1, 2, 0] } : {}}
            transition={{ duration: 1 }}
          >
            🔒
          </motion.div>
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center text-primary"
            >
              🌸
            </motion.div>
          )}
        </div>

        <h1 className="font-script text-5xl md:text-6xl text-white font-bold mb-4 text-glow">
          For Ishana <span className="text-4xl">💜</span>
        </h1>
        
        <p className="text-white/90 font-serif text-center mb-8 text-lg md:text-xl drop-shadow-md">
          Enter the magic word to begin your adventure...
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4 relative z-10">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/20 border-2 border-white/30 rounded-full px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 focus:bg-white/30 transition-all font-sans text-center text-xl shadow-inner interactive-button"
            placeholder="Password"
            disabled={success}
          />
          
          <div className="h-6">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#ffd700] text-sm font-medium drop-shadow-md"
              >
                That's not quite right... try again 🌸
              </motion.p>
            )}
          </div>

          <button 
            type="submit"
            disabled={success}
            className="interactive-button mt-2 px-8 py-3 rounded-full bg-primary/80 hover:bg-primary text-white font-serif font-medium tracking-wide shadow-lg hover:shadow-[0_0_15px_rgba(123,45,139,0.6)] transition-all backdrop-blur-sm border border-white/20"
          >
            Unlock
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
