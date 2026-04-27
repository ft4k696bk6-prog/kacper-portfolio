"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface TerminalToastProps {
  visible: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
  duration?: number;
}

export function TerminalToast({
  visible,
  onClose,
  type,
  message,
  duration = 6000,
}: TerminalToastProps) {
  const [progress, setProgress] = useState(100);
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      setProgress(100);
      return;
    }
    const step = 100 / (duration / 50);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p - step;
        if (next <= 0) {
          clearInterval(interval);
          onCloseRef.current();
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [visible, duration]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[9999] w-80 rounded-lg overflow-hidden shadow-2xl border border-slate-600/60"
          style={{ backgroundColor: "#1e1f22" }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/60"
            style={{ backgroundColor: "#2b2d30" }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="flex-1 text-center text-xs font-mono text-slate-400 -ml-10">
              Run
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-3 font-mono text-sm space-y-1">
            <div className="flex items-start gap-2">
              <span
                className={
                  type === "success" ? "text-green-400" : "text-red-400"
                }
              >
                &gt;
              </span>
              <span className="text-slate-200 leading-snug">{message}</span>
            </div>
            {type === "success" && (
              <div className="flex items-start gap-2">
                <span className="text-slate-600">&gt;</span>
                <span className="text-slate-500 text-xs">
                  Process finished with exit code 0
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-slate-700/50">
            <div
              className={`h-full ${
                type === "success" ? "bg-cyan-500" : "bg-red-500"
              }`}
              style={{ width: `${progress}%`, transition: "none" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
