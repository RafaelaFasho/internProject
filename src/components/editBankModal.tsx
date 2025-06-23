import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Bank } from "../types/Bank";
import { ACCESS_TOKEN } from "../constants/constants";
import "../styles/bankModals.css";

interface EditBankModalProps {
  isOpen: boolean;
  bank: Bank | null;
  onClose: () => void;
  onSave: (updatedBank: Bank) => void;
}

const EditBankModal: React.FC<EditBankModalProps> = ({
  isOpen,
  bank,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    balance: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bank) {
      setFormData({
        name: bank.name,
        code: bank.code,
        balance: bank.balance,
      });
      setError(null);
    }
  }, [bank]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (!bank) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("Unauthorized: please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/bankaccount/${bank.id}`,
        {
          name: formData.name,
          code: formData.code,
          balance: formData.balance,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSave(response.data.resultData);
    } catch (err) {
      setError("Failed to update bank account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="all-modal-header">
          <div className="modal-header">
            <h2>Edit {formData.name}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-form">
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </label>
          <label>
            Code:
            <input
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              disabled={loading}
            />
          </label>
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} disabled={loading} className="cancelButton">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="saveButton"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBankModal;
