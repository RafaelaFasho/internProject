import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Bank } from "../types/Bank";
import { ACCESS_TOKEN } from "../constants/constants";
import Sidebar from "../components/Sidebar";
import { ArrowLeft, PenLine, Trash2 } from "lucide-react";
import EditBankModal from "../components/editBankModal";
import DeleteBankModal from "../components/deleteBankModal";
import "../styles/bank.css";

const BankDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "delete">("edit");

  useEffect(() => {
    const fetchBankDetails = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("Unauthorized: please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/bankaccount/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBank(response.data.resultData);
      } catch (err) {
        setError("Failed to load bank details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBankDetails();
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleEditClick = () => {
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDeleteClick = () => {
    setModalMode("delete");
    setModalOpen(true);
  };

  const handleSave = (updatedBank: Bank) => {
    setBank(updatedBank);
    setModalOpen(false);
  };

  if (loading) return <p>Loading bank details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!bank) return <p>Bank not found</p>;

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        {/* header dhe butonat */}
        <div className="header-top">
          <div
            className="icon-group"
            onClick={handleBack}
            style={{ cursor: "pointer" }}
            aria-label="Go back"
          >
            <div className="header-icon">
              <ArrowLeft className="icon" />
            </div>
          </div>

          <div className="icon-group">
            <div
              className="header-icon"
              onClick={handleEditClick}
              style={{ cursor: "pointer" }}
              aria-label="Edit bank"
            >
              <PenLine className="icon" />
            </div>
            <div
              className="header-icon"
              onClick={handleDeleteClick}
              style={{ cursor: "pointer" }}
              aria-label="Delete bank"
            >
              <Trash2 className="icon" />
            </div>
          </div>
        </div>

        {/* detajet e bankës */}
        <div className="bankDetails">
          <h2>{bank.name}</h2>
          <p>{bank.code}</p>
          <h3>${bank.balance.toFixed(2)}</h3>
        </div>

        <EditBankModal
          isOpen={modalOpen && modalMode === "edit"}
          bank={bank}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />

        <DeleteBankModal
          isOpen={modalOpen && modalMode === "delete"}
          bank={bank}
          onClose={() => setModalOpen(false)}
          onConfirmDelete={async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token || !id) {
              setError("Unauthorized: please log in.");
              return;
            }
            try {
              await axiosInstance.delete(`/bankaccount/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setModalOpen(false);
              navigate("/bank");
            } catch {
              setError("Failed to delete bank account.");
            }
          }}
        />
      </div>
    </div>
  );
};

export default BankDetails;
