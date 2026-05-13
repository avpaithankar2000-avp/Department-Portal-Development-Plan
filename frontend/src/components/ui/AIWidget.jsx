import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

const messages = [
  { role: "assistant", text: "Hi, I can help visitors explore AIML department activities." },
  { role: "assistant", text: "Try asking about events, placements, internships, or achievements." }
];

const AIWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thread, setThread] = useState(messages);

  const send = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    setThread((prev) => [
      ...prev,
      { role: "user", text: input.trim() },
      { role: "assistant", text: "This is a placeholder assistant. Backend AI integration can be connected here." }
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            className="mb-4 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-[2rem] border border-white/50 bg-white/85 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-night/85"
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 p-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-sky-500 text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="font-bold text-ink dark:text-white">AIML Assistant</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preview mode</p>
                </div>
              </div>
              <button className="btn-secondary px-3 py-2" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto p-4">
              {thread.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl px-4 py-3 text-sm ${message.role === "user" ? "ml-8 bg-brand text-white" : "mr-8 bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100"}`}
                >
                  {message.text}
                </motion.div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-slate-200/70 p-4 dark:border-white/10">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask something..." />
              <button className="btn-primary px-4" aria-label="Send">
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand via-sky-500 to-coral text-white shadow-glow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 rounded-full bg-brand/40 blur-xl" />
        <Bot className="relative" size={27} />
      </motion.button>
    </div>
  );
};

export default AIWidget;
