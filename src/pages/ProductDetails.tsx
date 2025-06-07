import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../types/Product";
import { ACCESS_TOKEN } from "../constants/constants";
import { ArrowLeft, PenLine, Trash2 } from "lucide-react";
import "../index.css";
import ProductModal from "../components/createOrEditModal";
import { Category } from "../types/Category";
import DeleteModal from "../components/deleteModal";
import ChooseBankModal from "../components/chooseBankModal";

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
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChooseBankModalOpen, setIsChooseBankModalOpen] = useState(false);

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

  useEffect(() => {
    if (!id) return;

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

    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (
    updatedProduct: Product & { base64Image?: string | null }
  ) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("No auth token found, please login.");
        return;
      }

      const base64ImageClean = updatedProduct.base64Image
        ? updatedProduct.base64Image.replace(/^data:image\/\w+;base64,/, "")
        : undefined;

      const body: any = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        shortDescription: updatedProduct.shortDescription,
        longDescription: updatedProduct.longDescription,
        categoryId:
          typeof updatedProduct.categoryId === "string"
            ? parseInt(updatedProduct.categoryId, 10)
            : updatedProduct.categoryId,
        price: updatedProduct.price,
      };

      if (base64ImageClean) {
        body.base64Image = base64ImageClean;
      }

      const response = await fetch(
        `http://192.168.10.248:2208/api/product/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const data = await response.json();
      if (!data.resultData) {
        throw new Error("Server returned empty product data");
      }

      setProduct(data.resultData);
      setIsModalOpen(false);
      alert("Product updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update product");
    }
  };

  const handleBack = () => navigate(-1);

  const handleEditClick = () => {
    if (!categories?.data?.length) {
      alert("Categories not loaded yet, please wait a moment.");
      return;
    }
    if (!product) {
      alert("Product data is not loaded yet.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const openDeleteModal = () => {
    console.log("Delete modal should open now!");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setError("No auth token found, please login.");
        return;
      }

      const response = await fetch(
        `http://192.168.10.248:2208/api/product/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      alert("Product deleted successfully!");
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete product");
    } finally {
      closeDeleteModal();
    }
  };

  const handleConfirmBankAccount = (bankAccountId: number) => {
    alert(`You chose bank account ID: ${bankAccountId} to buy the product.`);

    setIsChooseBankModalOpen(false);
  };

  if (error) return <p className="error-message">{error}</p>;
  if (isCategoriesLoading)
    return <p className="loading-message">Loading categories...</p>;
  if (!product)
    return <p className="loading-message">Loading product details...</p>;

  return (
    <>
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
                aria-label="Edit product"
              >
                <PenLine className="icon" />
              </div>
              <div
                className="header-icon"
                onClick={openDeleteModal}
                style={{ cursor: "pointer" }}
                aria-label="Delete product"
              >
                <Trash2 className="icon" />
              </div>
            </div>
          </div>

          <div className="product-content">
            <div className="image-container">
              <img
                className="product-image"
                src={
                  product.base64Image
                    ? `data:image/png;base64,${product.base64Image}`
                    : "/placeholder-image.png"
                }
                alt={product.name}
              />
            </div>
            <div className="details-container">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-price">
                Price: {product.price.toFixed(2)} €
              </p>
              <p className="product-description">
                {product.longDescription || "No description available."}
              </p>
              <button
                className="buy-now-button"
                onClick={() => setIsChooseBankModalOpen(true)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && categories && product && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          categories={categories.data}
          existingProduct={{
            id: product.id,
            name: product.name,
            shortDescription: product.shortDescription || "",
            longDescription: product.longDescription || "",
            categoryId: product.categoryId,
            price: product.price,
            base64Image: product.base64Image,
          }}
          onSave={handleUpdateProduct}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        itemName={product ? product.name : "this product"}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {isChooseBankModalOpen && (
        <ChooseBankModal
          isOpen={isChooseBankModalOpen}
          onClose={() => setIsChooseBankModalOpen(false)}
          onConfirm={handleConfirmBankAccount}
        />
      )}
    </>
  );
}

export default ProductDetails;
