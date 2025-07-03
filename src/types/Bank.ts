export interface Bank {
  id: number;
  code: string;
  name: string;
  currencyId: number;
  balance: number;
  clientId: number;
  isActive: boolean;
}

export interface Transaction {
  id: number;
  bankAccountId: number;
  action: number;
  amount: number;
  description: string;
  isActive: boolean;
}

export interface EditBankModalProps {
  isOpen: boolean;
  bank: Bank | null;
  onClose: () => void;
  onSave: (updatedBank: Bank) => void;
}

export interface Currency {
  id: number;
  code: string;
  description: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Bank | Transaction) => void;
  mode: "bank" | "transaction";
  bankOptions?: Bank[];
  saving?: boolean;
}

export interface DeleteBankModalProps {
  isOpen: boolean;
  bank: Bank | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export interface ChooseBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bankAccountId: number) => void;
  amount: number;
}
