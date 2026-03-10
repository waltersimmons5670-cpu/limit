import { Info } from "lucide-react";

const InfoAlert = () => (
  <div className="rounded-xl border-l-4 border-l-primary bg-secondary p-4 flex gap-3 items-start">
    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
      <Info className="w-3 h-3 text-primary-foreground" />
    </div>
    <p className="text-sm text-foreground/80 leading-relaxed">
      Choose your new Fuliza limit and complete the payment to get instant access.
    </p>
  </div>
);

export default InfoAlert;
