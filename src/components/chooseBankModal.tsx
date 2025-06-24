import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import "../styles/bankModals.css";
import axiosInstance from "../utils/axios";

interface BankAccount {
  id: number;
  code: string;
  name: string;
  currencyId: number;
  balance: number;
  clientId: number;
  isActive: boolean;
}

interface ChooseBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bankAccountId: number) => void;
  amount: number;
}

const ChooseBankModal: React.FC<ChooseBankModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const response = await axiosInstance.get(`/bankaccount/get-all`, {
        headers: { token },
      });
      const data = response.data;

      setBankAccounts(
        data?.resultData?.data && Array.isArray(data.resultData.data)
          ? data.resultData.data
          : []
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen]);

  const handlePayNow = async () => {
    if (selectedAccountId === null) {
      alert("Please select a bank account.");
      return;
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        alert("User is not authenticated.");
        return;
      }

      const selectedAccount = bankAccounts.find(
        (account) => account.id === selectedAccountId
      );

      if (!selectedAccount) {
        alert("Bank account not found.");
        return;
      }

      console.log("Current balance before payment:", selectedAccount.balance);

      const updatedBalance = selectedAccount.balance - amount;

      console.log("Updated balance to send in PUT request:", updatedBalance);

      const putResponse = await axiosInstance.put(
        `/bankaccount/${selectedAccount.id}`,
        {
          balance: updatedBalance,
          currencyId: selectedAccount.currencyId,
        },
        { headers: { token } }
      );

      console.log("PUT response:", putResponse.data);

      alert(`Blerje e kryer për ${amount}€. Balanca e re: ${updatedBalance}€`);

      await fetchBankAccounts();

      onConfirm(selectedAccount.id);
    } catch (err: any) {
      alert(`Error during payment: ${err.message || "Unknown error"}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="all-modal-header">
          <h2>Choose Bank</h2>
          <button className="close-button" onClick={onClose}>
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
              <div className="bank-account-radio">
                {bankAccounts.map((account) => (
                  <label key={account.id}>
                    <input
                      type="radio"
                      name="bankAccount"
                      value={account.id}
                      checked={selectedAccountId === account.id}
                      onChange={() => setSelectedAccountId(account.id)}
                    />{" "}
                    Pay with {account.name}
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        <div>
          <button
            className="payNow-button"
            onClick={handlePayNow}
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
