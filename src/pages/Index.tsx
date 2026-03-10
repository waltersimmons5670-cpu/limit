import { useState } from "react";
import { Zap, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import InfoAlert from "@/components/InfoAlert";
import RecentIncreases from "@/components/RecentIncreases";
import LimitCard from "@/components/LimitCard";
import TrustFooter from "@/components/TrustFooter";
import PaymentModal from "@/components/PaymentModal";
import { limitOptions } from "@/lib/limits";

const Index = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCTA = () => {
    if (selectedIndex === null) return;
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md px-4 py-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-destructive">
            FULIZA LIMIT BOOST
          </h1>
          <p className="text-xs text-muted-foreground">
            Instant Limit Increase • No Paperwork • Same Day Access
          </p>
        </div>

        {/* Info Alert */}
        <InfoAlert />

        {/* Recent Increases */}
        <RecentIncreases />

        {/* Limit Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Select Your Fuliza Limit</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {limitOptions.map((opt, i) => (
              <motion.div
                key={opt.amount}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <LimitCard
                  option={opt}
                  selected={selectedIndex === i}
                  onSelect={() => setSelectedIndex(i)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleCTA}
          disabled={selectedIndex === null}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-button hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          Get Limit Now
        </button>

        {/* Trust Footer */}
        <TrustFooter />
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <PaymentModal
          option={limitOptions[selectedIndex]}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;
