import { ACCESS_TOKEN } from "../constants/constants";
import { Product } from "../types/Product";
import { useEffect, useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      console.log("access token:", localStorage.getItem(ACCESS_TOKEN));
      if (!token) {
        setError("No auth token found, please login.");
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.10.248:2208/api/product/get-all",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        //console.log("Data nga API:", data);
        console.log("ResultData.data:", data.resultData.data);
        setProducts(data.resultData.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {products.length === 0 && !error && <p>Loading products...</p>}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img
                src={`data:image/png;base64,${product.base64Image}`}
                alt={product.name}
              />
              <h4>{product.name}</h4>
              <p>{product.price} €</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
