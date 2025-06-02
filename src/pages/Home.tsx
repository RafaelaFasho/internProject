import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../index.css";
import Products from "../components/Products";

function Home() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Products />
      </div>
    </div>
  );
}

export default Home;
