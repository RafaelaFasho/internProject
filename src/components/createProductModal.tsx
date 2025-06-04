import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import { Upload } from "lucide-react";

interface Product {
  id: number;
  Name: string;
  ShortDescription: string;
  LongDescription: string;
  CategoryId: string;
  Price: string;
  ImageUrl?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: number; code: string; description: string }[];
  existingProduct?: Product;
}

const ProductModal = ({
  isOpen,
  onClose,
  categories,
  existingProduct,
}: ProductModalProps) => {
  const [formData, setFormData] = useState({
    Name: "",
    ShortDescription: "",
    LongDescription: "",
    CategoryId: "",
    Price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        Name: existingProduct.Name || "",
        ShortDescription: existingProduct.ShortDescription || "",
        LongDescription: existingProduct.LongDescription || "",
        CategoryId: existingProduct.CategoryId || "",
        Price: existingProduct.Price || "",
      });

      if (existingProduct.ImageUrl) {
        setPreviewUrl(existingProduct.ImageUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        Name: "",
        ShortDescription: "",
        LongDescription: "",
        CategoryId: "",
        Price: "",
      });
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [existingProduct, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Name || !formData.CategoryId || !formData.Price) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("Name", formData.Name);
    data.append("ShortDescription", formData.ShortDescription);
    data.append("LongDescription", formData.LongDescription);
    data.append("CategoryId", formData.CategoryId);
    data.append("Price", formData.Price);

    if (imageFile) {
      data.append("ImageUpload", imageFile);
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const url = existingProduct
        ? `http://192.168.10.248:2208/api/product/${existingProduct.id}`
        : "http://192.168.10.248:2208/api/product";
      const method = existingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert(
          existingProduct
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        onClose();
        setFormData({
          Name: "",
          ShortDescription: "",
          LongDescription: "",
          CategoryId: "",
          Price: "",
        });
        setImageFile(null);
        setPreviewUrl(null);
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        alert("Error while saving the product.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="all-modal-header">
          <div className="modal-header">
            <h2>{existingProduct ? "Edit Product" : "Create Product"}</h2>
            <p>
              Please complete all information to{" "}
              {existingProduct ? "update" : "create"} your product on the app.
            </p>
          </div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <textarea
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />

          <textarea
            name="LongDescription"
            placeholder="Long Description"
            value={formData.LongDescription}
            onChange={handleChange}
            rows={8}
          />

          <select
            name="CategoryId"
            value={formData.CategoryId}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.description}
              </option>
            ))}
          </select>

          <textarea
            name="Price"
            placeholder="Price"
            value={formData.Price}
            onChange={handleChange}
            required
          />

          <div className="upload-container">
            <label htmlFor="image-upload" className="upload-box">
              <Upload className="upload-icon" aria-label="Upload your image" />
              <span className="upload-text">Upload your image</span>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Uploaded Preview"
                className="preview"
              />
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit">
              {existingProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
