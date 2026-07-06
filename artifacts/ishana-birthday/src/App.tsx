import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ButterflyCursor from './components/ButterflyCursor';
import FloatingPetals from './components/FloatingPetals';
import Fireflies from './components/Fireflies';
import ConfettiSystem from './components/ConfettiSystem';
import HiddenGift from './components/HiddenGift';

import Scene1Password from './scenes/Scene1Password';
import Scene2CakeBuilder from './scenes/Scene2CakeBuilder';
import Scene3Letter from './scenes/Scene3Letter';
import Scene4Questions from './scenes/Scene4Questions';
import Scene5Final from './scenes/Scene5Final';

function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [confettiActive, setConfettiActive] = useState(false);

  // Debug skip shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'S') {
        setCurrentScene((prev) => Math.min(prev + 1, 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextScene = () => setCurrentScene((prev) => Math.min(prev + 1, 5));
  const restart = () => setCurrentScene(1);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 5000);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-br from-[#f8f0fc] to-[#e6d0f0] dark:from-[#2a0845] dark:to-[#1a0033]">
      {/* Global Effects */}
      <ButterflyCursor />
      <FloatingPetals />
      <Fireflies />
      {confettiActive && <ConfettiSystem />}
      <HiddenGift />

      {/* Scene Manager */}
      <AnimatePresence mode="wait">
        {currentScene === 1 && (
          <Scene1Password key="scene1" onComplete={nextScene} />
        )}
        {currentScene === 2 && (
          <Scene2CakeBuilder key="scene2" onComplete={nextScene} triggerConfetti={triggerConfetti} />
        )}
        {currentScene === 3 && (
          <Scene3Letter key="scene3" onComplete={nextScene} />
        )}
        {currentScene === 4 && (
          <Scene4Questions key="scene4" onComplete={nextScene} triggerConfetti={triggerConfetti} />
        )}
        {currentScene === 5 && (
          <Scene5Final key="scene5" onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
