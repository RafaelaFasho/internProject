import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { ProductModalProps, FormDataState } from "../types/Product";
import axiosInstance from "../utils/axios";
import "../styles/productModal.css";

const ProductModal = ({
  isOpen,
  onClose,
  categories,
  existingProduct,
  onSave,
}: ProductModalProps) => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    shortDescription: "",
    longDescription: "",
    categoryId: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        shortDescription: existingProduct.shortDescription || "",
        longDescription: existingProduct.longDescription || "",
        categoryId: existingProduct.categoryId?.toString() || "",
        price: existingProduct.price?.toString() || "",
      });

      if (existingProduct.imageUpload instanceof File) {
        const url = URL.createObjectURL(existingProduct.imageUpload);
        setPreviewUrl(url);
      } else if (typeof existingProduct.imageUpload === "string") {
        setPreviewUrl(existingProduct.imageUpload);
      } else if (typeof existingProduct.imageUpload === "string") {
        setPreviewUrl(
          `http://192.168.10.248:2208/${existingProduct.imageUpload}`
        );
      } else {
        setPreviewUrl(null);
      }

      setImageFile(null);
    } else {
      setFormData({
        name: "",
        shortDescription: "",
        longDescription: "",
        categoryId: "",
        price: "",
      });
      setPreviewUrl(null);
      setImageFile(null);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [existingProduct, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageFile(file);
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
      !formData.name.trim() ||
      !formData.categoryId ||
      !formData.price.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (!existingProduct && !imageFile) {
      alert("Product image is required!");
      return;
    }

    setSaving(true);

    try {
      const url = existingProduct
        ? `/product/${existingProduct.id}`
        : "/product";
      const method = existingProduct ? "put" : "post";

      const data = new FormData();
      data.append("Name", formData.name);
      data.append("ShortDescription", formData.shortDescription);
      data.append("LongDescription", formData.longDescription);
      data.append("CategoryId", formData.categoryId);
      data.append("Price", formData.price);

      if (imageFile) {
        data.append("ImageUpload", imageFile);
      }

      const response = await axiosInstance.request({
        url,
        method,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const savedData = response.data;

      if (!savedData || !savedData.resultData) {
        alert("Server returned empty product data");
        setSaving(false);
        return;
      }

      await onSave(savedData.resultData);

      console.log(savedData.resultData);

      alert(
        existingProduct
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      onClose();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Error while saving product.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="createOrEditModal">
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
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={saving}
          />

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            disabled={saving}
          />

          <textarea
            name="longDescription"
            placeholder="Long Description"
            value={formData.longDescription}
            onChange={handleChange}
            rows={6}
            disabled={saving}
          />

          <select
            name="categoryId"
            value={formData.categoryId}
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
            name="price"
            placeholder="Price"
            value={formData.price}
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
                style={{ maxHeight: 150, marginTop: 10 }}
              />
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit" disabled={saving}>
              {saving
                ? existingProduct
                  ? "Updating..."
                  : "Creating..."
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
