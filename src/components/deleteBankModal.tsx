import React, { useState } from "react";
import { Bank } from "../types/Bank";
import "../styles/bankModals.css";

interface DeleteBankModalProps {
  isOpen: boolean;
  bank: Bank | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteBankModal: React.FC<DeleteBankModalProps> = ({
  isOpen,
  bank,
  onClose,
  onConfirmDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeleteClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirmDelete();
    } catch (err) {
      setError("Failed to delete bank account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="all-modal-header">
          <div className="modal-header">
            <h2>Delete: {bank?.name}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>

        <p>
          Are you sure you want to delete this bank? If you delete your bank all
          the information saved will be permanently gone.
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-buttons">
          <button className="cancelButton" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="deleteButton"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBankModal;
