import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import { Upload } from "lucide-react";
import { Product } from "../types/Product";
import { Category } from "../types/Category";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  existingProduct?: Product;
  onSave: (updatedProduct: Product) => Promise<void>;
}

const ProductModal = ({
  isOpen,
  onClose,
  categories,
  existingProduct,
  onSave,
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        Name: existingProduct.name || "",
        ShortDescription: existingProduct.shortDescription || "",
        LongDescription: existingProduct.longDescription || "",
        CategoryId: existingProduct.categoryId || "",
        Price: existingProduct.price?.toString() || "",
      });
      setPreviewUrl(existingProduct.base64Image || null);
      setImageFile(null);
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

  useEffect(() => {
    return () => {
      if (previewUrl && imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (previewUrl && imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Name.trim() ||
      !formData.CategoryId ||
      !formData.Price.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        alert("Unauthorized: please log in.");
        setSaving(false);
        return;
      }

      console.log("Token length:", token.length);
      if (token.length > 8000) {
        alert("Your authorization token is too large.");
        setSaving(false);
        return;
      }

      const data = new FormData();

      if (existingProduct) {
        data.append("Name", formData.Name || existingProduct.name || "");
        data.append(
          "ShortDescription",
          formData.ShortDescription || existingProduct.shortDescription || ""
        );
        data.append(
          "LongDescription",
          formData.LongDescription || existingProduct.longDescription || ""
        );
        data.append(
          "CategoryId",
          formData.CategoryId || existingProduct.categoryId || ""
        );
        data.append(
          "Price",
          formData.Price || existingProduct.price?.toString() || ""
        );
      } else {
        data.append("Name", formData.Name);
        data.append("ShortDescription", formData.ShortDescription);
        data.append("LongDescription", formData.LongDescription);
        data.append("CategoryId", formData.CategoryId);
        data.append("Price", formData.Price);
      }

      if (imageFile) {
        data.append("ImageUpload", imageFile);
      }

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

      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error saving product: ${errorText}`);
        setSaving(false);
        return;
      }

      const savedData = await res.json();

      if (!savedData || !savedData.resultData) {
        alert("Server returned empty product data");
        setSaving(false);
        return;
      }

      await onSave(savedData.resultData);

      alert(
        existingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error while saving product.");
    } finally {
      setSaving(false);
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
          <button className="close-button" onClick={onClose} disabled={saving}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            disabled={saving}
          />

          <textarea
            name="ShortDescription"
            placeholder="Short Description"
            value={formData.ShortDescription}
            onChange={handleChange}
            disabled={saving}
          />

          <textarea
            name="LongDescription"
            placeholder="Long Description"
            value={formData.LongDescription}
            onChange={handleChange}
            rows={6}
            disabled={saving}
          />

          <select
            name="CategoryId"
            value={formData.CategoryId}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.description}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="Price"
            placeholder="Price"
            value={formData.Price}
            onChange={handleChange}
            required
            disabled={saving}
            min="0"
            step="0.01"
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
                disabled={saving}
              />
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Uploaded Preview"
                className="preview"
                style={{ maxHeight: "150px", marginTop: "10px" }}
              />
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? existingProduct
                  ? "Updating..."
                  : "Adding..."
                : existingProduct
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
