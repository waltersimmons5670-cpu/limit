import { Lock, Shield, Zap, CheckCircle } from "lucide-react";

const items = [
  { icon: Lock, label: "Secure" },
  { icon: Shield, label: "Encrypted" },
  { icon: Zap, label: "Instant" },
  { icon: CheckCircle, label: "Verified" },
];

const TrustFooter = () => (
  <div className="bg-card rounded-xl p-4 shadow-card">
    <div className="flex justify-around">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TrustFooter;
