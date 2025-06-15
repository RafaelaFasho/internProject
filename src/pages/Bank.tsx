import Sidebar from "../components/Sidebar";
import BankContent from "../components/BankContent";
import "../index.css";

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
