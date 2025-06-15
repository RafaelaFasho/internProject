export interface Transaction {
  id: number;
  bankAccountId: number;
  action: number;
  amount: number;
  description: string;
  isActive: boolean;
}
