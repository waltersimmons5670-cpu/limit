import { ArrowUpRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { LimitOption } from "@/lib/limits";
import { formatKsh } from "@/lib/limits";

interface Props {
  option: LimitOption;
  selected: boolean;
  onSelect: () => void;
}

const LimitCard = ({ option, selected, onSelect }: Props) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
    className={`relative rounded-[15px] p-4 min-h-[90px] w-full text-left transition-all duration-200 shadow-sm ${
      selected
        ? "border-2 border-primary ring-1 ring-primary/20"
        : "border border-border hover:border-primary/40"
    }`}
    style={{
      background: "#ffffff",
      boxShadow: selected ? "0 0 12px 2px hsla(152, 100%, 32%, 0.15)" : undefined,
    }}
  >
    {/* HOT badge — absolute, no layout impact */}
    {option.isHot && (
      <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide leading-none">
        Hot
      </span>
    )}

    {/* Check icon when selected — absolute */}
    {selected && (
      <span className={`absolute ${option.isHot ? "top-8" : "top-2"} right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center`}>
        <Check className="w-3 h-3 text-primary-foreground" />
      </span>
    )}

    {/* Amount */}
    <span className={`text-lg font-bold block mb-2 ${selected ? "text-primary" : "text-foreground"}`}>
      {formatKsh(option.amount)}
    </span>

    {/* Fee pill */}
    <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
      Fee: {formatKsh(option.fee)}
    </span>

    {/* Arrow icon — absolute bottom-right */}
    <ArrowUpRight className="absolute bottom-3 right-3 w-3.5 h-3.5 text-primary opacity-40" />
  </motion.button>
);

export default LimitCard;
