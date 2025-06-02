import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import ProductModal from "./createProductModal"; // importo modalin
import "../index.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
};

type Category = {
  id: number;
  code: string;
  description: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Nëse ke kategori

  // Funksioni për marrjen e produkteve
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(
        "http://192.168.10.248:2208/api/product/get-all",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        if (data?.resultData?.data && Array.isArray(data.resultData.data)) {
          setProducts(data.resultData.data);
        } else {
          alert("Unexpected data format received from server.");
          setProducts([]);
        }
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(`Error fetching products: ${data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // Funksioni për marrjen e kategorive nëse nuk i ke ende
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(
        "http://192.168.10.248:2208/api/category/get-all",
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCategories(data?.resultData?.data || []);
      }
    } catch (e) {
      console.error("Error fetching categories", e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="products-container">
      <button onClick={() => setModalOpen(true)}>Add Product</button>

      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          categories={categories}
        />
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
