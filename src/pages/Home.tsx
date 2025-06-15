import Sidebar from "../components/Sidebar";
import HomeContent from "../components/HomeContent";
import "../index.css";

function Home() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <HomeContent />
      </div>
    </div>
  );
}

export default Home;
