import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Bank } from "../types/Bank";
import { Transaction } from "../types/Transactions";
import axiosInstance from "../utils/axios";
import "../styles/bankModals.css";

interface Currency {
  id: number;
  code: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Bank | Transaction) => void;
  mode: "bank" | "transaction";
  bankOptions?: Bank[];
  saving?: boolean;
}

const BankOrTransactionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  bankOptions = [],
  saving = false,
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [bankData, setBankData] = useState<Bank>({
    id: 0,
    code: "",
    name: "",
    currencyId: 0,
    balance: 0,
    clientId: 0,
    isActive: true,
  });

  const [transactionData, setTransactionData] = useState<Transaction>({
    id: 0,
    bankAccountId: 0,
    action: 0,
    amount: 0,
    description: "",
    isActive: true,
  });

  // Kur modal hapet, marrim valutën dhe resetojmë fushat sipas modalit
  useEffect(() => {
    if (isOpen) {
      axiosInstance
        .get("/currency/get-all")
        .then((response) => {
          const nestedData = response.data?.resultData?.data;
          if (Array.isArray(nestedData)) {
            setCurrencies(nestedData);
          } else {
            setCurrencies([]);
          }
        })
        .catch(() => setCurrencies([]));

      // Reset fushat
      if (mode === "bank") {
        setBankData({
          id: 0,
          code: "",
          name: "",
          currencyId: 0,
          balance: 0,
          clientId: 0,
          isActive: true,
        });
      } else {
        setTransactionData({
          id: 0,
          bankAccountId: 0,
          action: 0,
          amount: 0,
          description: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(mode === "bank" ? bankData : transactionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="all-modal-header">
          <div className="modal-header">
            <h2>{mode === "bank" ? "Add Bank" : "Add Transaction"}</h2>
            <p>Please complete all information to add your {mode}.</p>
          </div>
          <button className="close-button" onClick={onClose} disabled={saving}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === "bank" ? (
            <>
              <input
                type="text"
                placeholder="Bank Name"
                value={bankData.name}
                onChange={(e) =>
                  setBankData({ ...bankData, name: e.target.value })
                }
                required
                disabled={saving}
              />
              <input
                type="text"
                placeholder="Code"
                value={bankData.code}
                onChange={(e) =>
                  setBankData({ ...bankData, code: e.target.value })
                }
                required
                disabled={saving}
              />

              <select
                value={bankData.currencyId || ""}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    currencyId: Number(e.target.value),
                  })
                }
                required
                disabled={saving}
              >
                <option value="">Choose currency</option>
                {currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.description}
                    </option>
                  ))
                ) : (
                  <option disabled>No currencies available</option>
                )}
              </select>

              <input
                type="number"
                placeholder="Balance"
                value={bankData.balance === 0 ? "" : bankData.balance}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    balance: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                required
                disabled={saving}
                min="0"
                step="0.01"
              />
            </>
          ) : (
            <>
              <select
                value={transactionData.bankAccountId || ""}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    bankAccountId: Number(e.target.value),
                  })
                }
                required
                disabled={saving}
              >
                <option value="">Choose your bank</option>
                {bankOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>

              <select
                value={
                  transactionData.action !== undefined
                    ? transactionData.action
                    : ""
                }
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    action: Number(e.target.value),
                  })
                }
                required
                disabled={saving}
              >
                <option value="">Select action</option>
                <option value={0}>Deposit</option>
                <option value={1}>Withdraw</option>
              </select>

              <input
                type="number"
                placeholder="Amount"
                value={
                  transactionData.amount === 0 ? "" : transactionData.amount
                }
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    amount: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                required
                disabled={saving}
                min="0.01"
                step="0.01"
              />

              <input
                type="text"
                placeholder="Description"
                value={transactionData.description}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    description: e.target.value,
                  })
                }
                disabled={saving}
              />
            </>
          )}

          <div className="modal-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : `Add ${mode === "bank" ? "Bank" : "Transaction"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankOrTransactionModal;
