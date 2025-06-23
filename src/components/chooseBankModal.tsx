import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import "../styles/bankModals.css";
import axiosInstance from "../utils/axios";

interface BankAccount {
  id: number;
  accountNumber: string;
  bankName: string;
  balance: number;
}

interface ChooseBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bankAccountId: number) => void;
}

const ChooseBankModal: React.FC<ChooseBankModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchBankAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance(`/bankaccount/get-all`, {
          headers: {
            token: token,
          },
        });

        const data = response.data;
        setBankAccounts(Array.isArray(data.resultData) ? data.resultData : []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="chooseBank-modal">
        <div className="delete-modal-header">
          <h2>Choose Bank Account</h2>
          <button className="delete-close-button" onClick={onClose}>
            X
          </button>
        </div>
        {loading && <p>Loading bank accounts...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <>
            {bankAccounts.length === 0 ? (
              <p>No bank accounts available.</p>
            ) : (
              <ul className="bank-account-list">
                {bankAccounts.map((account) => (
                  <li key={account.id}>
                    <label>
                      <input
                        type="radio"
                        name="bankAccount"
                        value={account.id}
                        checked={selectedAccountId === account.id}
                        onChange={() => setSelectedAccountId(account.id)}
                      />
                      {account.bankName} - {account.accountNumber} (Balance:{" "}
                      {account.balance.toFixed(2)} €)
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div>
          <button
            className="payNow-button"
            onClick={() => {
              if (selectedAccountId !== null) {
                onConfirm(selectedAccountId);
              } else {
                alert("Please select a bank account.");
              }
            }}
            disabled={selectedAccountId === null}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseBankModal;
