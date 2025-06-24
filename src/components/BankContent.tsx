import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Bank } from "../types/Bank";
import { Transaction } from "../types/Transactions";
import { ACCESS_TOKEN } from "../constants/constants";
import "../styles/bank.css";
import BankOrTransactionModal from "./createBankOrTransactionModal";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BankContent = () => {
  const [activeSection, setActiveSection] = useState<
    "bankList" | "transactions"
  >("bankList");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"bank" | "transaction">("bank");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("Unauthorized: please log in.");
      setLoading(false);
      return;
    }

    try {
      if (activeSection === "bankList") {
        const response = await axiosInstance.get(`/bankaccount/get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBanks(response.data.resultData.data);
      } else if (activeSection === "transactions") {
        const response = await axiosInstance.get(`/banktransaction/get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.resultData.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleAdd = () => {
    setModalMode(activeSection === "bankList" ? "bank" : "transaction");
    setModalOpen(true);
  };

  const handleSave = async (data: Bank | Transaction) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    setSaving(true);
    try {
      if ("code" in data) {
        await axiosInstance.post("/bankaccount", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const { id, ...transactionPayload } = data;
        console.log("Payload që po dërgohet:", transactionPayload);
        await axiosInstance.post("/banktransaction", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      //console.log("TRANSACTION PAYLOAD:", data);
      await fetchData();
    } catch (err) {
      setError("Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      await axiosInstance.delete(`/banktransaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Failed to delete transaction");
    }
  };

  return (
    <div>
      <div className="bankHeader">
        <button
          className={activeSection === "bankList" ? "active" : ""}
          onClick={() => setActiveSection("bankList")}
        >
          Bank List
        </button>
        <button
          className={activeSection === "transactions" ? "active" : ""}
          onClick={() => setActiveSection("transactions")}
        >
          Transactions
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : activeSection === "bankList" ? (
        <div className="bankListSection">
          <div className="bankTopRow">
            <h2>Bank Accounts</h2>
            <button className="bankAddButton" onClick={handleAdd}>
              Add Bank
            </button>
          </div>

          <div className="bankGrid">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="bankCard"
                onClick={() => navigate(`/bank/${bank.id}`)}
              >
                <h3>{bank.name}</h3>
                <p>{bank.code}</p>
                <h2>{bank.balance.toFixed(2)}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="transactionsSection">
          <div className="bankTopRow">
            <h2>Transactions List</h2>
            <button className="bankAddButton" onClick={handleAdd}>
              Add Transaction
            </button>
          </div>
          <ul className="transactionList">
            {transactions.map((txn) => (
              <li key={txn.id} className="transactionWrapper">
                <div className="transactionItem">
                  <span className="transactionDescription">
                    {txn.description}
                  </span>
                  <span className="transactionAmount">${txn.amount}</span>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTransaction(txn.id)}
                  title="Delete Transaction"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <BankOrTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        bankOptions={banks}
        saving={saving}
      />
    </div>
  );
};

export default BankContent;
