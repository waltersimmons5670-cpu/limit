import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Zap, Lock } from "lucide-react";
import type { LimitOption } from "@/lib/limits";
import { formatKsh } from "@/lib/limits";

interface Props {
  option: LimitOption;
  open: boolean;
  onClose: () => void;
}

type Stage = "form" | "processing" | "success";

const PaymentModal = ({ option, open, onClose }: Props) => {
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ id?: string; phone?: string }>({});
  const [stage, setStage] = useState<Stage>("form");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feeAmount = useMemo(() => option.fee, [option.fee]);

  const validate = () => {
    const e: typeof errors = {};
    if (!idNumber.trim()) e.id = "ID number is required";
    const cleaned = phone.replace(/\s/g, "");
    if (!/^(07\d{8}|2547\d{8})$/.test(cleaned))
      e.phone = "Enter a valid Kenyan phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const normalizePhone = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.startsWith("07")) return `254${cleaned.slice(1)}`;
    return cleaned;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setStage("processing");

    const payload = {
      amount: String(feeAmount),
      msisdn: normalizePhone(phone),
      id_number: idNumber.trim(),
      limit_amount: String(option.amount),
      reference: `LIMIT-${option.amount}-${Date.now()}`,
    };

    try {
      const res = await fetch("/api/initiate-stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to initiate payment");
      }

      setStage("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setSubmitError(message);
      setStage("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStage("form");
    setIdNumber("");
    setPhone("");
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Complete Your Request</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter your details to boost your Fuliza limit to{" "}
                  <span className="font-semibold text-primary">{formatKsh(option.amount)}</span>
                </p>
              </div>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {stage === "form" && (
                <>
                  {/* Summary */}
                  <div className="bg-secondary rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">New Limit</span>
                      <span className="font-semibold text-foreground">{formatKsh(option.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Access Fee</span>
                      <span className="font-semibold text-primary">{formatKsh(feeAmount)}</span>
                    </div>
                  </div>

                  {/* ID Input */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      ID Number
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="Enter your ID number"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      />
                    </div>
                    {errors.id && <p className="text-xs text-destructive mt-1">{errors.id}</p>}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XXXXXXXX"
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      You will receive an M-Pesa STK push on this number
                    </p>
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>

                  {submitError && (
                    <p className="text-xs text-destructive text-center">{submitError}</p>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-button hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {isSubmitting ? "REQUESTING STK..." : "PAY THE ACCESS FEE"}
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Secure payment powered by M-Pesa
                  </p>
                </>
              )}

              {stage === "processing" && (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-foreground">Processing STK Push...</p>
                  <p className="text-xs text-muted-foreground">Check your phone for the M-Pesa prompt</p>
                </div>
              )}

              {stage === "success" && (
                <div className="py-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-foreground">Limit Boosted!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Your Fuliza limit has been increased to{" "}
                    <span className="font-semibold text-primary">{formatKsh(option.amount)}</span>
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
