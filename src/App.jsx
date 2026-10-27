import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuote } from './hooks/useQuote';
import { 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  WifiOff, 
  AlertCircle,
  Sliders,
  Compass,
  Radio
} from 'lucide-react';

const REALMS = [
  {
    id: 'emerald',
    name: 'Emerald Aurora',
    accent: '#10b981',
    accentLight: '#34d399',
    particleColor: '16, 185, 129',
    chord: [220.00, 277.18, 329.63, 415.30]
  },
  {
    id: 'void',
    name: 'Cosmic Indigo',
    accent: '#6366f1',
    accentLight: '#818cf8',
    particleColor: '99, 102, 241',
    chord: [261.63, 329.63, 392.00, 493.88]
  },
  {
    id: 'supernova',
    name: 'Rose Sunset',
    accent: '#f43f5e',
    accentLight: '#fb7185',
    particleColor: '244, 63, 94',
    chord: [293.66, 369.99, 440.00, 554.37]
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    accent: '#06b6d4',
    accentLight: '#22d3ee',
    particleColor: '6, 182, 212',
    chord: [349.23, 440.00, 523.25, 659.25]
  }
];

export default function App() {
  const { quote, loading, error, isOfflineMode, fetchQuote } = useQuote();
  const [realmIdx, setRealmIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioFx, setAudioFx] = useState(true);
  const [words, setWords] = useState([]);

  const activeRealm = REALMS[realmIdx];
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // 1. Procedural Celestial Chord Synthesizer
  const playCelestialChord = useCallback((chordFreqs) => {
    if (!audioFx) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.12 + (idx * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1 + (idx * 0.08));

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + (idx * 0.03));
        osc.stop(ctx.currentTime + 1.3);
      });
    } catch (e) {
      // AudioContext unavailable or muted
    }
  }, [audioFx]);

  // 2. Word Cascade Trigger
  useEffect(() => {
    if (quote?.content) {
      setWords(quote.content.split(' '));
      playCelestialChord(activeRealm.chord);
    }
  }, [quote, activeRealm, playCelestialChord]);

  // 3. Interactive Particle Background Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const mouse = { x: width / 2, y: height / 2 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.45 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${activeRealm.particleColor}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgb(${activeRealm.particleColor})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [activeRealm]);

  // 4. Waveform Audio Synthesizer Canvas
  useEffect(() => {
    const waveCanvas = waveCanvasRef.current;
    if (!waveCanvas) return;
    const ctx = waveCanvas.getContext('2d');
    let waveAnim;
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      const w = waveCanvas.width;
      const h = waveCanvas.height;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = activeRealm.accentLight;

      for (let x = 0; x < w; x++) {
        const amplitude = isSpeaking ? 10 : 2;
        const y = h / 2 + Math.sin(x * 0.08 + phase) * amplitude * Math.sin((x / w) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isSpeaking ? 0.16 : 0.03;
      waveAnim = requestAnimationFrame(renderWave);
    };
    renderWave();

    return () => cancelAnimationFrame(waveAnim);
  }, [isSpeaking, activeRealm]);

  // 5. Card Hover & Tilt Tracking
  const handleMouseMoveCard = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;

    card.style.transition = 'none';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseLeaveCard = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  // 6. Native Speech Synthesis
  const handleSpeak = () => {
    if (!quote?.content || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${quote.content} by ${quote.author}`);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 7. Clipboard Copy
  const handleCopy = async () => {
    if (!quote?.content) return;
    try {
      await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 bg-[#05070c] text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Background Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Atmospheric Radial Light */}
      <div 
        style={{ backgroundColor: activeRealm.accent }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] opacity-15 blur-[140px] rounded-full pointer-events-none transition-colors duration-1000 ease-out z-0"
      />

      {/* Header Bar */}
      <header className="w-full max-w-3xl flex items-center justify-between py-3.5 px-6 rounded-2xl bg-[#0c1017]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg z-20">
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
          Quote Generator
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setAudioFx(!audioFx)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all flex items-center gap-1.5 ${
              audioFx 
                ? 'bg-white/[0.08] text-white border-white/[0.2] shadow-sm' 
                : 'bg-white/[0.02] text-slate-500 border-white/[0.06]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{audioFx ? 'CHORD: ON' : 'MUTED'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRealmIdx((prev) => (prev + 1) % REALMS.length)}
            style={{ borderColor: `${activeRealm.accent}50`, color: activeRealm.accentLight }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{activeRealm.name}</span>
          </button>

          {isOfflineMode && (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-[11px]">
              <WifiOff className="w-3 h-3" /> Cached
            </span>
          )}
        </div>
      </header>

      {/* Center Quote Card */}
      <main className="w-full max-w-3xl my-auto py-10 z-10 perspective-container">
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div
          ref={cardRef}
          onMouseMove={handleMouseMoveCard}
          onMouseLeave={handleMouseLeaveCard}
          className="group relative rounded-3xl bg-[#0c1017] border border-white/[0.08] hover:border-white/[0.18] p-8 sm:p-14 shadow-[0_20px_70px_rgba(0,0,0,0.6)] transition-colors duration-300 overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Spotlight Highlight Effect */}
          <div 
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(550px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(255, 255, 255, 0.05), transparent 70%)'
            }}
          />

          {/* Frequency Visualizer Header */}
          <div className="relative flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06] z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>FREQUENCY</span>
            </div>
            <canvas 
              ref={waveCanvasRef} 
              width="160" 
              height="32" 
              className="opacity-80"
            />
          </div>

          {/* Quote Body */}
          <div className="relative min-h-[160px] flex flex-col justify-center z-10">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-white/[0.05] rounded-xl w-11/12" />
                <div className="h-8 bg-white/[0.05] rounded-xl w-3/4" />
                <div className="h-5 bg-white/[0.03] rounded-lg w-1/4 mt-8" />
              </div>
            ) : (
              <div>
                <blockquote className="text-2xl sm:text-4xl font-serif leading-[1.45] text-slate-50 font-normal tracking-wide">
                  “{words.map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="animate-word mr-[0.28em]"
                      style={{ animationDelay: `${i * 24}ms` }}
                    >
                      {word}
                    </span>
                  ))}”
                </blockquote>

                <div className="mt-10 flex items-center gap-3 pt-6 border-t border-white/[0.06]">
                  <div 
                    style={{ backgroundColor: activeRealm.accent }}
                    className="w-2.5 h-2.5 rounded-full transition-colors duration-500 shadow-sm" 
                  />
                  <cite className="not-italic text-base sm:text-lg font-semibold tracking-wide text-white">
                    {quote?.author}
                  </cite>
                </div>
              </div>
            )}
          </div>

          {/* Action Dock */}
          <div className="relative mt-12 pt-6 border-t border-white/[0.06] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 z-10">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <button
                type="button"
                onClick={handleSpeak}
                disabled={loading}
                title="Speech Synthesizer"
                aria-label="Speech Synthesizer"
                className={`p-3 rounded-2xl border transition-all ${
                  isSpeaking 
                    ? 'bg-white text-black border-white shadow-md' 
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.08]'
                } disabled:opacity-40`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                disabled={loading}
                title="Copy Quote"
                aria-label="Copy Quote"
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-all disabled:opacity-40"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={fetchQuote}
              disabled={loading}
              style={{
                backgroundColor: activeRealm.accent,
                boxShadow: `0 4px 20px ${activeRealm.accent}33`
              }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm text-white tracking-wide transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'LOADING...' : 'NEW QUOTE'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Copy Alert Toast */}
      {copied && (
        <div className="fixed bottom-6 right-6 bg-[#0f1422] border border-emerald-500/40 text-emerald-300 text-xs font-mono py-2.5 px-4 rounded-2xl shadow-xl z-50 flex items-center gap-2">
          <Check className="w-3.5 h-3.5" /> Copied to clipboard
        </div>
      )}
    </div>
  );
}