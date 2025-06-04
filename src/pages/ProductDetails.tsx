import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { ACCESS_TOKEN } from "../constants/constants";
import { ArrowLeft, PenLine, Trash2 } from "lucide-react";
import "../index.css";
import ProductModal from "../components/createProductModal";
import { Category } from "../types/Category";

interface CategoriesResponse {
  data: Category[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          setError("No auth token found, please login.");
          return;
        }

        const res = await fetch(
          "http://192.168.10.248:2208/api/category/get-all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const rawData = await res.json();
        console.log("Fetched categories:", rawData);

        setCategories(rawData.resultData);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Failed to fetch categories");
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          setError("No auth token found, please login.");
          return;
        }

        const response = await fetch(
          `http://192.168.10.248:2208/api/product/${id}`,
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
        setProduct(data.resultData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch product details");
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!product)
    return <p className="loading-message">Loading product details...</p>;
  if (isCategoriesLoading)
    return <p className="loading-message">Loading categories...</p>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    if (!categories || categories.data.length === 0) {
      alert("Categories not loaded yet, please wait a moment.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="page">
        <Sidebar />

        <div className="main-content">
          <div className="header-top">
            <div className="icon-group" onClick={handleBack}>
              <div className="header-icon">
                <ArrowLeft className="icon" />
              </div>
            </div>

            <div className="icon-group">
              <div className="header-icon" onClick={handleEditClick}>
                <PenLine className="icon" />
              </div>
              <div
                className="header-icon"
                onClick={() => console.log("Delete")}
              >
                <Trash2 className="icon" />
              </div>
            </div>
          </div>

          <div className="product-content">
            <div className="image-container">
              <img
                className="product-image"
                src={`data:image/png;base64,${product.base64Image}`}
                alt={product.name}
              />
            </div>
            <div className="details-container">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-price">Price: {product.price} €</p>
              <p className="product-description">
                {product.longDescription || "No description available."}
              </p>
              <button className="buy-now-button">Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && categories && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          categories={categories.data}
          existingProduct={{
            id: product.id,
            Name: product.name,
            ShortDescription: product.shortDescription || "",
            LongDescription: product.longDescription || "",
            CategoryId: product.categoryId,
            Price: product.price.toString(),
            ImageUrl: product.base64Image
              ? `data:image/png;base64,${product.base64Image}`
              : undefined,
          }}
        />
      )}
    </>
  );
}

export default ProductDetails;
