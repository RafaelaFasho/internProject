import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { Bank } from "../types/Bank";
import { ACCESS_TOKEN } from "../constants/constants";
import Sidebar from "../components/Sidebar";
import { ArrowLeft, PenLine, Trash2 } from "lucide-react";

const BankDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    navigate(`/banks/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this bank account?"
    );
    if (!confirm || !id) return;

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("Unauthorized: please log in.");
      return;
    }

    try {
      await axiosInstance.delete(`/bankaccount/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/banks");
    } catch (err) {
      setError("Failed to delete bank account.");
    }
  };

  if (loading) return <p>Loading bank details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!bank) return <p>Bank not found</p>;

  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
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
              onClick={handleDelete}
              style={{ cursor: "pointer" }}
              aria-label="Delete bank"
            >
              <Trash2 className="icon" />
            </div>
          </div>
        </div>

        <div className="bank-details">
          <h2>{bank.name}</h2>
          <p>
            <strong>Code:</strong> {bank.code}
          </p>
          <p>
            <strong>Balance:</strong> ${bank.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
