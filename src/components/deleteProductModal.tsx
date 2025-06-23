import React from "react";
import "../styles/productModal.css";

interface DeleteModalProps {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  itemName,
  onCancel,
  onConfirm,
  saving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>Delete {itemName}</h2>
          <p>
            Are you sure you want to delete {itemName}? If you delete your
            product it will be permanently gone.
          </p>
          <button
            className="delete-close-button"
            onClick={onCancel}
            disabled={saving}
          >
            X
          </button>
        </div>

        <div className="delete-modal-buttons">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="delete-button"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
