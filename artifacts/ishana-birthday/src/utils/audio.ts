export function playHappyBirthday() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Happy birthday melody notes (frequency, duration)
  const notes = [
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 293.66, dur: 1 },   // D4
    { freq: 261.63, dur: 1 },   // C4
    { freq: 349.23, dur: 1 },   // F4
    { freq: 329.63, dur: 2 },   // E4
    
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 293.66, dur: 1 },   // D4
    { freq: 261.63, dur: 1 },   // C4
    { freq: 392.00, dur: 1 },   // G4
    { freq: 349.23, dur: 2 },   // F4
    
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 261.63, dur: 0.5 }, // C4
    { freq: 523.25, dur: 1 },   // C5
    { freq: 440.00, dur: 1 },   // A4
    { freq: 349.23, dur: 1 },   // F4
    { freq: 329.63, dur: 1 },   // E4
    { freq: 293.66, dur: 2 },   // D4
    
    { freq: 466.16, dur: 0.5 }, // Bb4
    { freq: 466.16, dur: 0.5 }, // Bb4
    { freq: 440.00, dur: 1 },   // A4
    { freq: 349.23, dur: 1 },   // F4
    { freq: 392.00, dur: 1 },   // G4
    { freq: 349.23, dur: 2 },   // F4
  ];

  let time = audioCtx.currentTime;
  const tempo = 1.3; // Speed modifier

  notes.forEach((note) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, time);
    
    // Envelope to make it sound soft like a music box
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (note.dur / tempo) - 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(time);
    osc.stop(time + (note.dur / tempo));
    
    time += (note.dur / tempo);
  });
}

export function playChime() {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // Slide up to A6
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
}
