import { useState, useEffect } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import "../index.css";
import ProductModal from "./createOrEditModal";
import { ACCESS_TOKEN } from "../constants/constants";
import { Product } from "../types/Product";

type Category = {
  id: number;
  code: string;
  description: string;
};

const PRODUCTS_PER_PAGE = 20;

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | "all" | null
  >("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(
        "http://192.168.10.248:2208/api/category/get-all",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        if (data?.resultData?.data && Array.isArray(data.resultData.data)) {
          const sortedData = data.resultData.data.sort(
            (a: Category, b: Category) => a.id - b.id
          );
          setCategories(sortedData);
        } else {
          alert("Unexpected data format received.");
          setCategories([]);
        }
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(`Error fetching categories: ${data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId: number | "all" | null) => {
    setLoadingProducts(true);
    setError(null);
    setProducts([]);
    setVisibleProducts([]);
    setCurrentPage(1);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setError("No auth token found, please login.");
      setLoadingProducts(false);
      return;
    }

    let url = "";
    if (categoryId === "all" || categoryId === null) {
      url = "http://192.168.10.248:2208/api/product/get-all?limit=1000";
    } else {
      url = `http://192.168.10.248:2208/api/product/${categoryId}/get-all?limit=1000`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const allProducts = Array.isArray(data.resultData.data)
        ? data.resultData.data
        : [];
      console.log("Fetched products count:", allProducts.length);
      setProducts(allProducts);
      setVisibleProducts(allProducts.slice(0, PRODUCTS_PER_PAGE));
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategoryId);
  }, [selectedCategoryId]);

  const loadMoreProducts = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setVisibleProducts((prev) => [
      ...prev,
      ...products.slice(startIndex, endIndex),
    ]);
    setCurrentPage(nextPage);
  };

  const handleAddCategory = async (code: string, description: string) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch("http://192.168.10.248:2208/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ code, description }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Category added successfully!");
        await fetchCategories();
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(
          `Error while creating the category: ${
            data?.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEditCategory = async (
    id: number,
    code: string,
    description: string
  ) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(`http://192.168.10.248:2208/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ code, description }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Category updated successfully!");
        await fetchCategories();
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(
          `Error while updating the category: ${
            data?.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await fetch(`http://192.168.10.248:2208/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();

      if (res.ok) {
        alert("Category deleted successfully!");
        if (selectedCategoryId === id) setSelectedCategoryId("all");
        await fetchCategories();
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(
          `Error while deleting the category: ${
            data?.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const onClickEditCategory = () => {
    if (selectedCategoryId === null || selectedCategoryId === "all") {
      alert("Please select a category to edit.");
      return;
    }
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    if (!category) {
      alert("Category not found.");
      return;
    }
    const newCode = prompt("Edit category code:", category.code);
    if (!newCode) return;
    const newDescription = prompt(
      "Edit category description:",
      category.description
    );
    if (!newDescription) return;

    handleEditCategory(selectedCategoryId, newCode, newDescription);
  };

  const onClickAddCategory = () => {
    const newCode = prompt("Enter new category code:");
    if (!newCode) return;
    const newDescription = prompt("Enter new category description:");
    if (!newDescription) return;

    handleAddCategory(newCode, newDescription);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    console.log("Saving product", updatedProduct);
    setIsProductModalOpen(false);
  };

  return (
    <>
      <div className="header-container">
        <div className="header-top">
          <label>Categories</label>
          <div className="icon-group">
            <div
              className="header-icon"
              onClick={onClickEditCategory}
              title="Edit selected category"
            >
              <PenLine className="icon" />
            </div>
            <div
              className="header-icon"
              onClick={onClickAddCategory}
              title="Add new category"
            >
              <Plus className="icon" />
            </div>
            <div
              className="header-icon"
              onClick={() =>
                selectedCategoryId !== null &&
                selectedCategoryId !== "all" &&
                handleDeleteCategory(selectedCategoryId)
              }
              title="Delete selected category"
              style={{
                cursor:
                  selectedCategoryId !== null && selectedCategoryId !== "all"
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  selectedCategoryId !== null && selectedCategoryId !== "all"
                    ? 1
                    : 0.5,
              }}
            >
              <Trash2 className="icon" />
            </div>
          </div>
        </div>

        {loading ? (
          <div>Loading categories...</div>
        ) : (
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-button ${
                  selectedCategoryId === cat.id ? "selected" : ""
                }`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.code}
              </button>
            ))}
          </div>
        )}

        <div className="header-bottom">
          <label>Recommended for you</label>
          <button
            className="add-product-button"
            onClick={() => setIsProductModalOpen(true)}
          >
            Add Product
          </button>
        </div>

        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          categories={categories}
          existingProduct={undefined}
          onSave={handleSaveProduct}
        />
      </div>

      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loadingProducts && <p>Loading products...</p>}
        {!loadingProducts && visibleProducts.length === 0 && (
          <p>No products found.</p>
        )}

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img
                  src={`data:image/png;base64,${product.base64Image}`}
                  alt={product.name}
                />
                <label>{product.name}</label>
                <p>{product.price} €</p>
              </Link>
            </div>
          ))}
        </div>

        {visibleProducts.length < products.length && (
          <div className="load-more-container">
            <button onClick={loadMoreProducts}>Load More</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
