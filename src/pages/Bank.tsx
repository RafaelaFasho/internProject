import Sidebar from "../components/Sidebar";
import BankContent from "../components/BankContent";
import "../styles/bank.css";

function Bank() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <BankContent />
      </div>
    </div>
  );
}

export default Bank;
