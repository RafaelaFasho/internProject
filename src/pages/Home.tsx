import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../index.css";
import ProductList from "../components/ProductList";

function Home() {
  return (
    <div className="page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <ProductList />
      </div>
    </div>
  );
}

export default Home;
