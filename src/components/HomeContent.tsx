import { useState, useEffect } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ProductModal from "./createOrEditModal";
import { Product } from "../types/Product";
import axiosInstance from "../utils/axios";
import { Category } from "../types/Category";

const PRODUCTS_PER_PAGE = 10;

const HomeContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | "all" | null
  >("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/category/get-all");
      const data = res.data;

      if (data?.resultData?.data && Array.isArray(data.resultData.data)) {
        const sortedData = data.resultData.data.sort(
          (a: Category, b: Category) => a.id - b.id
        );
        setCategories(sortedData);
      } else {
        alert("Unexpected data format received.");
        setCategories([]);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert(
          `Error fetching categories: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
      }
      console.error("fetchCategories error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (
    categoryId: number | "all" | null,
    page: number
  ) => {
    setLoadingProducts(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("PageNumber", page.toString());
      params.append("PageSize", PRODUCTS_PER_PAGE.toString());

      let url = "/product/get-all";
      if (categoryId !== "all" && categoryId !== null) {
        url = `/product/${categoryId}/get-all`;
      }

      const response = await axiosInstance.get(`${url}?${params.toString()}`);
      const data = response.data;

      if (data?.resultData?.data && Array.isArray(data.resultData.data)) {
        setProducts(data.resultData.data);
        setCurrentPage(data.resultData.currentPage);
        setTotalPages(data.resultData.totalPages);
      } else {
        setProducts([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategoryId, currentPage);
  }, [selectedCategoryId, currentPage]);

  const handleAddCategory = async (code: string, description: string) => {
    try {
      await axiosInstance.post("/category", { code, description });
      alert("Category added successfully!");
      await fetchCategories();
    } catch (err: any) {
      alert(
        `Error while creating the category: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      console.error(err);
    }
  };
  const handleEditCategory = async (
    id: number,
    code: string,
    description: string
  ) => {
    try {
      await axiosInstance.put(`/category/${id}`, { code, description });
      alert("Category updated successfully!");
      await fetchCategories();
    } catch (err: any) {
      alert(
        `Error while updating the category: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      console.error(err);
    }
  };
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axiosInstance.delete(`/category/${id}`);
      alert("Category deleted successfully!");
      if (selectedCategoryId === id) setSelectedCategoryId("all");
      await fetchCategories();
    } catch (err: any) {
      alert(
        `Error while deleting the category: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      console.error(err);
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
              style={{
                cursor:
                  selectedCategoryId === "all" || selectedCategoryId === null
                    ? "not-allowed"
                    : "pointer",
              }}
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
              onClick={() => {
                if (
                  selectedCategoryId !== null &&
                  selectedCategoryId !== "all"
                ) {
                  handleDeleteCategory(selectedCategoryId);
                }
              }}
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
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setCurrentPage(1);
                }}
              >
                {cat.code}
              </button>
            ))}
            <button
              className={`category-button ${
                selectedCategoryId === "all" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedCategoryId("all");
                setCurrentPage(1);
              }}
            >
              All
            </button>
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

        {!loadingProducts && products.length === 0 && <p>No products found.</p>}

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img
                  src={
                    product.imagePath && product.imagePath.trim() !== ""
                      ? product.imagePath
                      : "/default.jpg"
                  }
                  alt={product.name}
                />
                <label>{product.name}</label>
                <p>{product.price} €</p>
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: "20px" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  marginRight: "5px",
                  marginBottom: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  backgroundColor:
                    currentPage === index + 1 ? "#7be4e8" : "#242424",
                  color: currentPage === index + 1 ? "#242424" : "#fff",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomeContent;
