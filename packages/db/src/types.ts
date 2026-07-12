export type Transaction = {
  id: number;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  date: string;
  category?: string;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  color?: string;
  createdAt: string;
};
