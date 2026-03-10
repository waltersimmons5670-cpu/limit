export interface LimitOption {
  amount: number;
  fee: number;
  isHot?: boolean;
}

export const limitOptions: LimitOption[] = [
  { amount: 5000, fee: 150 },
  { amount: 7500, fee: 199 },
  { amount: 10000, fee: 249 },
  { amount: 12500, fee: 345 },
  { amount: 16000, fee: 450 },
  { amount: 21000, fee: 550 },
  { amount: 25500, fee: 649, isHot: true },
  { amount: 30000, fee: 700, isHot: true },
  { amount: 35000, fee: 850 },
  { amount: 40000, fee: 1000 },
  { amount: 45000, fee: 1250 },
  { amount: 50000, fee: 1500 },
  { amount: 60000, fee: 1750 },
  { amount: 70000, fee: 2050 },
];

export const formatKsh = (n: number) =>
  `Ksh ${n.toLocaleString("en-KE")}`;
