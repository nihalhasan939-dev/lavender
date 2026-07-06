import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playHappyBirthday } from '../utils/audio';

/* ─── Types ─────────────────────────────────────────────────── */
type CakeChoice = {
  base: 'chocolate' | 'vanilla' | null;
  cream: 'mango' | 'orange' | null;
  decor: 'sprinkles' | 'chips' | null;
  topper: 'butterfly' | 'teddy' | null;
};
type Round = 1 | 2 | 3 | 4 | 5;

/* ─── Cake geometry ─────────────────────────────────────────── */
const CW   = 210;  // cake width
const LH   = 38;   // single layer height
const SH   = 7;    // cream separator height
const FH   = 14;   // frosting cap height
const DW   = CW + 16; // frosting / drip strip (slightly wider)

/* ─── Fixed drip config ─────────────────────────────────────── */
const DRIPS = [
  { l:  4, h: 28, w: 15 },
  { l: 26, h: 18, w: 13 },
  { l: 50, h: 34, w: 16 },
  { l: 76, h: 22, w: 14 },
  { l: 102,h: 38, w: 17 },
  { l: 130,h: 20, w: 13 },
  { l: 155,h: 30, w: 15 },
  { l: 177,h: 16, w: 12 },
  { l: 198,h: 26, w: 14 },
];

/* ─── Fixed sprinkle / chip positions on frosting surface ──── */
const TOPPERS_POS = Array.from({ length: 20 }, (_, i) => ({
  x: 6  + (i * 41) % (CW - 12),
  y: 2  + (i * 7)  % (FH - 4),
  rot: (i * 53) % 360,
}));

const SPRINKLE_COLORS = ['#FF3B30', '#FFFFFF', '#5AC8FA', '#FF2D55', '#34C759', '#FFD60A'];

/* ─── Layer colors ──────────────────────────────────────────── */
const LAYER = {
  chocolate: { body: '#4a1e08', top: '#6b3316', bottom: '#2d1005' },
  vanilla:   { body: '#f0d78a', top: '#fff5cc', bottom: '#d4b864' },
};
const SEP = {
  mango:  '#ffe08a',
  orange: '#ffbf80',
};

/* ─── Spring presets ────────────────────────────────────────── */
const DROP  = { type: 'spring' as const, stiffness: 520, damping: 26, mass: 1.1 };
const SOFT  = { type: 'spring' as const, stiffness: 300, damping: 24 };

/* ─── Flat 2D Cake Layer ────────────────────────────────────── */
function CakeLayer({
  base, delay = 0,
}: { base: 'chocolate' | 'vanilla'; delay?: number }) {
  const c = LAYER[base];
  return (
    <motion.div
      initial={{ y: -560 }}
      animate={{ y: 0 }}
      transition={{ ...DROP, delay }}
      style={{ width: CW, height: LH, position: 'relative', flexShrink: 0 }}
    >
      {/* Top highlight edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 6,
        background: c.top,
      }} />
      {/* Main body */}
      <div style={{
        position: 'absolute', top: 6, left: 0, right: 0, bottom: 0,
        background: c.body,
      }} />
      {/* Bottom shadow edge */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 4,
        background: c.bottom,
      }} />
    </motion.div>
  );
}

/* ─── Cream separator ───────────────────────────────────────── */
function CreamSep({ cream, delay = 0 }: { cream: 'mango' | 'orange'; delay?: number }) {
  return (
    <motion.div
      initial={{ y: -560 }}
      animate={{ y: 0 }}
      transition={{ ...DROP, delay }}
      style={{
        width: CW + 4,
        height: SH,
        background: SEP[cream],
        alignSelf: 'center',
        flexShrink: 0,
      }}
    />
  );
}

/* ─── Frosting cap + drips ──────────────────────────────────── */
function Frosting({ cream, delay = 0 }: { cream: 'mango' | 'orange'; delay?: number }) {
  /* frosting is white; color only tints the very tip of drips */
  const tipColor = cream === 'mango' ? '#ffe566' : '#ffca80';
  return (
    <motion.div
      initial={{ y: -560 }}
      animate={{ y: 0 }}
      transition={{ ...DROP, delay }}
      style={{ position: 'relative', width: DW, alignSelf: 'center', flexShrink: 0 }}
    >
      {/* White cap */}
      <div style={{
        height: FH,
        background: '#fff',
        borderRadius: '6px 6px 0 0',
        position: 'relative',
        zIndex: 2,
      }} />
      {/* Drip blobs */}
      <div style={{ position: 'relative', zIndex: 1, height: 0 }}>
        {DRIPS.map((d, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: d.h }}
            transition={{ ...SOFT, delay: delay + 0.08 + i * 0.06 }}
            style={{
              position: 'absolute',
              left: d.l,
              top: -2,
              width: d.w,
              borderRadius: '0 0 50% 50%',
              background: `linear-gradient(180deg, #fff 60%, ${tipColor} 100%)`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Decoration (sprinkles / chips) on frosting surface ────── */
function Decoration({ type }: { type: 'sprinkles' | 'chips' }) {
  return (
    <div style={{
      position: 'absolute', left: (DW - CW) / 2, width: CW,
      top: 0, height: FH, overflow: 'hidden', zIndex: 10,
      pointerEvents: 'none',
    }}>
      {TOPPERS_POS.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 + 0.1, type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          {type === 'sprinkles' ? (
            <div style={{
              width: 4, height: 11,
              borderRadius: 3,
              background: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
            }} />
          ) : (
            <div style={{
              width: 9, height: 6,
              borderRadius: '50%',
              background: '#2c1208',
              boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Candle + flame ────────────────────────────────────────── */
function Candle({ blownOut }: { blownOut: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* Flame */}
      <AnimatePresence>
        {!blownOut && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scaleX: 2.5, scaleY: 0.1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ position: 'relative', marginBottom: -2 }}
          >
            {/* Outer flame */}
            <div style={{
              width: 18, height: 28,
              borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
              background: 'radial-gradient(ellipse at 50% 75%, #FF9800 0%, #FF5500 50%, #CC2200 100%)',
              animation: 'flameOuter 1.4s ease-in-out infinite alternate',
              filter: 'blur(0.4px)',
              transformOrigin: 'bottom center',
            }} />
            {/* Mid flame — wrapper handles centering; child handles animation */}
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              width: 0, height: 0, overflow: 'visible',
            }}>
              <div style={{
                position: 'absolute', bottom: 0,
                width: 12, height: 20,
                marginLeft: -6,        /* center without transform so keyframe won't fight it */
                borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                background: 'radial-gradient(ellipse at 50% 75%, #FFE500 0%, #FF9800 60%)',
                animation: 'flameMid 1.0s ease-in-out infinite alternate',
                transformOrigin: 'bottom center',
              }} />
            </div>
            {/* Core — same pattern */}
            <div style={{
              position: 'absolute', bottom: 2, left: '50%',
              width: 0, height: 0, overflow: 'visible',
            }}>
              <div style={{
                position: 'absolute', bottom: 0,
                width: 6, height: 12,
                marginLeft: -3,
                borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                background: 'radial-gradient(ellipse at 50% 75%, #FFFDE7, #FFE082)',
                animation: 'flameCore 0.7s ease-in-out infinite alternate',
                transformOrigin: 'bottom center',
              }} />
            </div>
            {/* Glow */}
            <div style={{
              position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
              width: 32, height: 32, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,180,0,0.45) 0%, transparent 70%)',
              animation: 'flameGlow 1.2s ease-in-out infinite alternate',
              pointerEvents: 'none',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blown-out smoke */}
      <AnimatePresence>
        {blownOut && (
          <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)' }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0.6, y: 0, x: 0, scale: 0.4 }}
                animate={{ opacity: 0, y: -50 - i * 14, x: (i % 2 === 0 ? -8 : 8) * (i + 1), scale: 1.8 }}
                transition={{ duration: 1.4 + i * 0.3, delay: i * 0.12, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 12, height: 16,
                  borderRadius: '50%',
                  background: 'rgba(200,200,200,0.5)',
                  filter: 'blur(3px)',
                  left: -6 + i * 3,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Wick */}
      <div style={{ width: 3, height: 6, background: '#111', borderRadius: 2 }} />
      {/* Candle body — plain white */}
      <div style={{
        width: 14, height: 58,
        background: 'linear-gradient(90deg, #e8e8e8 0%, #ffffff 40%, #f0f0f0 100%)',
        borderRadius: '3px 3px 2px 2px',
        boxShadow: '2px 0 4px rgba(0,0,0,0.08)',
      }} />
      {/* Wax pool */}
      <div style={{
        width: 20, height: 7, borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        marginTop: -3,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }} />
    </div>
  );
}

/* ─── Equalizer bars ────────────────────────────────────────── */
function Equalizer() {
  return (
    <div style={{
      position: 'absolute', left: -60, right: -60, bottom: -4,
      height: 48, display: 'flex', alignItems: 'flex-end',
      gap: 2, opacity: 0.55, pointerEvents: 'none', zIndex: 0,
    }}>
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: ['15%', `${35 + (i * 17) % 65}%`, '18%', `${45 + (i * 11) % 55}%`, '12%'],
          }}
          transition={{
            duration: 0.7 + (i % 4) * 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.06,
          }}
          style={{
            flex: 1,
            borderRadius: '2px 2px 0 0',
            background: `hsl(${268 + i * 3}, 65%, 62%)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main scene ────────────────────────────────────────────── */
export default function Scene2CakeBuilder({
  onComplete,
  triggerConfetti,
}: {
  onComplete: () => void;
  triggerConfetti: () => void;
}) {
  const [round, setRound]             = useState<Round>(1);
  const [cake, setCake]               = useState<CakeChoice>({ base: null, cream: null, decor: null, topper: null });
  const [blowing, setBlowing]         = useState(false);
  const [countdown, setCountdown]     = useState<number | null>(null);
  const [blownOut, setBlownOut]       = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  // Guard: ignore extra clicks while the layer-drop animation is playing
  const [picking, setPicking]         = useState(false);

  const handleSelect = useCallback((key: keyof CakeChoice, val: string) => {
    if (picking) return;
    setPicking(true);
    setCake(prev => ({ ...prev, [key]: val }));
    setTimeout(() => {
      setRound(r => (r < 5 ? (r + 1) as Round : r));
      setPicking(false);
    }, 800);
  }, [picking]);

  const handleBlow = useCallback(() => {
    setBlowing(true);
    let n = 3;
    setCountdown(n);
    const iv = setInterval(() => {
      n--;
      if (n > 0) {
        setCountdown(n);
      } else {
        clearInterval(iv);
        setCountdown(null);
        setBlownOut(true);
        triggerConfetti();
        setTimeout(() => {
          playHappyBirthday();
          setMusicPlaying(true);
          setTimeout(() => setShowContinue(true), 3000);
        }, 600);
      }
    }, 1000);
  }, [triggerConfetti]);

  // Total assembled cake height (for positioning candle on top)
  // Layer 1 + Sep + Layer 2 + Sep + Layer 3 + Frosting
  const cakeStackH = LH + SH + LH + SH + LH + FH;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="relative w-full h-full flex flex-col items-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#f3e8ff 0%,#e9d5ff 40%,#f0e6ff 100%)' }}
    >
      {/* Ambient floating dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ['0%', '110%'], opacity: [0, 0.45, 0] }}
            transition={{ duration: 7 + (i % 5) * 1.5, repeat: Infinity, delay: i * 0.9, ease: 'linear' }}
            className="absolute w-2 h-2 rounded-full bg-purple-300/40"
            style={{ left: `${(i * 7) % 100}%`, top: '-4%' }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.h1
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring' }}
        className="font-script text-3xl md:text-4xl font-bold mt-8 mb-1 text-center text-[#6b21a8] drop-shadow-sm px-4 z-20"
      >
        {round <= 4 ? 'Build your birthday cake! 🎂' : 'Make a wish! ✨'}
      </motion.h1>

      <AnimatePresence mode="wait">
        {round <= 4 && (
          <motion.p
            key={round}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="font-sans text-xs font-semibold text-purple-400 mb-3 z-20 tracking-widest uppercase"
          >
            Step {round} of 4
          </motion.p>
        )}
      </AnimatePresence>

      {/* Choice buttons */}
      <div className="z-30 mb-4 min-h-[90px] flex items-center">
        <AnimatePresence mode="wait">
          {round === 1 && (
            <OptionPanel key="r1" label="Choose your cake base"
              opts={[
                { label: 'Chocolate', emoji: '🍫', value: 'chocolate', color: '#6b3316' },
                { label: 'Vanilla',   emoji: '🍰', value: 'vanilla',   color: '#d4a017' },
              ]}
              onSelect={v => handleSelect('base', v)}
            />
          )}
          {round === 2 && (
            <OptionPanel key="r2" label="Choose your cream"
              opts={[
                { label: 'Mango',  emoji: '🥭', value: 'mango',  color: '#FF9800' },
                { label: 'Orange', emoji: '🍊', value: 'orange', color: '#FF5722' },
              ]}
              onSelect={v => handleSelect('cream', v)}
            />
          )}
          {round === 3 && (
            <OptionPanel key="r3" label="Choose your topping"
              opts={[
                { label: 'Sprinkles',   emoji: '🌈', value: 'sprinkles', color: '#FF3B30' },
                { label: 'Choco Chips', emoji: '🍪', value: 'chips',     color: '#3D1C02' },
              ]}
              onSelect={v => handleSelect('decor', v)}
            />
          )}
          {round === 4 && (
            <OptionPanel key="r4" label="Choose your topper"
              opts={[
                { label: 'Butterfly', emoji: '🦋', value: 'butterfly', color: '#9C27B0' },
                { label: 'Teddy',     emoji: '🧸', value: 'teddy',     color: '#795548' },
              ]}
              onSelect={v => handleSelect('topper', v)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Cake stage ─────────────────────────────────────────── */}
      <div className="relative flex-1 w-full flex items-end justify-center pb-16 z-20">
        <div style={{ position: 'relative', width: DW + 20 }}>

          {/* Equalizer behind cake (when music playing) */}
          {musicPlaying && (
            <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0 }}>
              <Equalizer />
            </div>
          )}

          {/* Plate */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: DW + 30, height: 16,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #e8d5f0, #c8a2c8)',
            boxShadow: '0 6px 20px rgba(100,0,150,0.2)',
            zIndex: 1,
          }} />

          {/* Candle + topper — positioned above cake stack */}
          {cake.topper && (
            <motion.div
              initial={{ y: -500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...DROP, delay: 0 }}
              style={{
                position: 'absolute',
                bottom: 14 + cakeStackH, // sit right on top of cake
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Topper emoji floats above candle */}
              <motion.span
                animate={blownOut ? {} : {
                  y: [0, -5, 0],
                  rotate: cake.topper === 'butterfly' ? [-6, 6, -6] : [0, 0, 0],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: 36, lineHeight: 1, marginBottom: 4, filter: 'drop-shadow(0 2px 6px rgba(100,0,200,0.3))' }}
              >
                {cake.topper === 'butterfly' ? '🦋' : '🧸'}
              </motion.span>
              <Candle blownOut={blownOut} />
            </motion.div>
          )}

          {/* ── Cake layers + frosting stacked column ── */}
          {/* We build bottom-to-top using flexbox column-reverse so layers stack naturally */}
          <div style={{
            position: 'absolute',
            bottom: 14, // sit on plate
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            zIndex: 10,
          }}>

            {/* Layer 1 — after base chosen */}
            {cake.base && <CakeLayer base={cake.base} delay={0} />}

            {/* Separator 1 + Layer 2 — after cream chosen */}
            {cake.cream && <>
              <CreamSep cream={cake.cream} delay={0} />
              <CakeLayer base={cake.base!} delay={0.04} />
            </>}

            {/* Separator 2 + Layer 3 + Frosting — after decor chosen */}
            {cake.decor && <>
              <CreamSep cream={cake.cream!} delay={0} />
              <CakeLayer base={cake.base!} delay={0.04} />
              {/* Frosting sits on top of top layer */}
              <div style={{ position: 'relative', alignSelf: 'center' }}>
                <Frosting cream={cake.cream!} delay={0.1} />
                {/* Decoration on frosting surface */}
                <Decoration type={cake.decor} />
              </div>
            </>}
          </div>
        </div>
      </div>

      {/* ── Blow button ─────────────────────────────────────────── */}
      <AnimatePresence>
        {round === 5 && !blowing && (
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={handleBlow}
            className="absolute bottom-20 z-50 px-10 py-4 text-white font-semibold text-lg rounded-full shadow-2xl"
            style={{
              background: 'linear-gradient(135deg,#9333ea,#7c3aed)',
              boxShadow: '0 0 30px rgba(147,51,234,0.5)',
              fontFamily: 'Lora, serif',
            }}
          >
            Blow the Candle ✨
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Countdown overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
          >
            <span
              className="font-script font-bold"
              style={{
                fontSize: 130,
                color: '#7c3aed',
                textShadow: '0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(147,51,234,0.4)',
              }}
            >
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue button ─────────────────────────────────────── */}
      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            transition={{ type: 'spring', stiffness: 280 }}
            className="absolute bottom-10 z-50 px-8 py-3 font-semibold rounded-full border"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              color: '#6b21a8',
              borderColor: 'rgba(147,51,234,0.3)',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
              fontFamily: 'Lora, serif',
            }}
          >
            Continue to your letter →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Option Panel ───────────────────────────────────────────── */
function OptionPanel({
  label, opts, onSelect,
}: {
  label: string;
  opts: { label: string; emoji: string; value: string; color: string }[];
  onSelect: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex flex-col items-center gap-4"
    >
      <p
        className="font-semibold text-[#6b21a8] text-xs uppercase tracking-widest px-4 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)' }}
      >
        {label}
      </p>
      <div className="flex gap-5">
        {opts.map(opt => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.09, y: -5 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl font-semibold shadow-lg border"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(12px)',
              borderColor: `${opt.color}50`,
              color: '#3b0764',
              fontFamily: 'Lora, serif',
              minWidth: 115,
              boxShadow: `0 4px 20px ${opt.color}28`,
            }}
          >
            <span style={{ fontSize: 34 }}>{opt.emoji}</span>
            <span className="text-sm">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
