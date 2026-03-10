import { Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { limitOptions, formatKsh } from "@/lib/limits";

const generateMessage = () => {
  const prefixes = ["070", "071", "072", "074", "075", "076", "079"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const d1 = Math.floor(Math.random() * 10);
  const d6 = Math.floor(Math.random() * 10);
  const d7 = Math.floor(Math.random() * 10);
  const phone = `${prefix}${d1}****${d6}${d7}`;
  const amount = limitOptions[Math.floor(Math.random() * limitOptions.length)].amount;
  const mins = Math.floor(Math.random() * 59) + 1;
  return `${phone} increased to ${formatKsh(amount)} – ${mins} min${mins > 1 ? "s" : ""} ago`;
};

const RecentIncreases = () => {
  const [message, setMessage] = useState(generateMessage);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(generateMessage());
      setKey((k) => k + 1);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Recent increases</span>
      </div>
      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={key}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-xs text-muted-foreground absolute inset-x-0"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden flex mt-3">
        <div className="h-full bg-primary w-[40%]" />
        <div className="h-full bg-destructive w-[20%]" />
        <div className="h-full bg-primary w-[40%]" />
      </div>
    </div>
  );
};

export default RecentIncreases;
