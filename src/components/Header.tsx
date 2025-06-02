import { useState, useEffect } from "react";
import { PenLine, Plus, Trash2 } from "lucide-react";
import "../index.css";
import ProductModal from "./createProductModal";
import { ACCESS_TOKEN } from "../constants/constants";

type Category = {
  id: number;
  code: string;
  description: string;
  // createdAt?: string;  // Shtoje nëse API e ka këtë fushë
};

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Funksion për marrjen e kategorive nga API
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
      console.log(
        "Categories fetched from API:",
        JSON.stringify(data, null, 2)
      );

      if (res.ok) {
        if (data?.resultData?.data && Array.isArray(data.resultData.data)) {
          // Rendit kategoritë sipas ID-së (nga më e vogla tek më e madhja)
          const sortedData = data.resultData.data.sort(
            (a: Category, b: Category) => a.id - b.id
          );
          setCategories(sortedData);
        } else {
          alert("Unexpected data format received from server.");
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const openProductModal = () => setIsProductModalOpen(true);
  const closeProductModal = () => setIsProductModalOpen(false);

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
      console.log("Response after add:", JSON.stringify(data, null, 2));

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
      console.log("Response after update:", JSON.stringify(data, null, 2));

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
      console.log("Response after delete:", JSON.stringify(data, null, 2));

      if (res.ok) {
        alert("Category deleted successfully!");
        if (selectedCategoryId === id) setSelectedCategoryId(null);
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
    if (selectedCategoryId === null) {
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

  return (
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
              handleDeleteCategory(selectedCategoryId)
            }
            title="Delete selected category"
            style={{
              cursor: selectedCategoryId !== null ? "pointer" : "not-allowed",
              opacity: selectedCategoryId !== null ? 1 : 0.5,
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
        <button className="add-product-button" onClick={openProductModal}>
          Add Product
        </button>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        categories={categories}
      />
    </div>
  );
};

export default Header;
