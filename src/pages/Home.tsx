import Sidebar from "../components/Sidebar";
import Header from "../components/HomeContent";
import "../index.css";

function Home() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <Header />
      </div>
    </div>
  );
}

export default Home;
