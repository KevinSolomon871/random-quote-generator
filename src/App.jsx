import React, { useState } from 'react';
import { useQuote } from './hooks/useQuote';
import { 
  Quote as QuoteIcon, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Share2, 
  WifiOff, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function App() {
  const { quote, loading, error, isOfflineMode, fetchQuote } = useQuote();
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text to Speech
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

  // Copy Quote to Clipboard
  const handleCopy = async () => {
    if (!quote?.content) return;
    const textToCopy = `"${quote.content}" — ${quote.author}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy quote', err);
    }
  };

  // Share to Twitter/X
  const handleTwitterShare = () => {
    if (!quote?.content) return;
    const tweet = encodeURIComponent(`"${quote.content}" — ${quote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 bg-[#0a0d14] text-slate-100 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-4 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">IEEE Quote Engine</h1>
            <p className="text-xs text-slate-400 font-mono">v1.0.0 • Resilient Web Dev Task</p>
          </div>
        </div>

        {/* Offline Badge */}
        {isOfflineMode && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Cache</span>
          </div>
        )}
      </header>

      {/* Quote Card */}
      <main className="w-full max-w-2xl my-auto z-10">
        {error && (
          <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative rounded-2xl bg-[#121722]/80 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl shadow-black/50 transition-all duration-300">
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="mb-6 inline-flex p-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <QuoteIcon className="w-6 h-6 rotate-180" />
          </div>

          <div className="min-h-[140px] flex flex-col justify-center">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-slate-800/80 rounded-md w-11/12" />
                <div className="h-6 bg-slate-800/80 rounded-md w-4/5" />
                <div className="h-4 bg-slate-800/50 rounded-md w-1/3 mt-6" />
                <p className="text-xs text-indigo-400/80 font-mono tracking-wide pt-2">
                  Fetching fresh inspiration...
                </p>
              </div>
            ) : (
              <div>
                <blockquote className="text-xl sm:text-2xl font-serif font-normal leading-relaxed text-slate-100">
                  “{quote?.content}”
                </blockquote>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <cite className="not-italic text-sm sm:text-base font-medium text-indigo-200">
                      {quote?.author}
                    </cite>
                  </div>

                  {quote?.tags && quote.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {quote.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={handleSpeak}
                disabled={loading}
                title={isSpeaking ? "Stop Speaking" : "Read Quote Aloud"}
                aria-label="Read quote aloud"
                className={`p-2.5 rounded-xl border transition-all ${
                  isSpeaking 
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 ring-2 ring-indigo-500/30' 
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                disabled={loading}
                title="Copy to Clipboard"
                aria-label="Copy quote to clipboard"
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleTwitterShare}
                disabled={loading}
                title="Share to X"
                aria-label="Share to X"
                className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={fetchQuote}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25 border border-indigo-400/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Fetching...' : 'New Quote'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2 z-10">
        <span>IEEE-VIT Web Dev Task Submission</span>
        <span>Built with React + Vite + Tailwind CSS</span>
      </footer>
    </div>
  );
}