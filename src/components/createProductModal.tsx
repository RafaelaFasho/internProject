import { useState } from "react";
import { ACCESS_TOKEN } from "../constants/constants";
import { Upload } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: number; code: string; description: string }[];
}

const ProductModal = ({ isOpen, onClose, categories }: ProductModalProps) => {
  const [formData, setFormData] = useState({
    Name: "",
    ShortDescription: "",
    LongDescription: "",
    CategoryId: "",
    Price: "",
  });

  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
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
    if (image) {
      data.append("ImageUpload", image);
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);

      const res = await fetch("http://192.168.10.248:2208/api/product", {
        method: "POST",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert("Product added successfully!");
        onClose();
      } else if (res.status === 401) {
        alert("Unauthorized: please log in again.");
      } else {
        alert("Error while creating the product.");
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
            <h2>Create Product</h2>
            <p>
              Please complete all information to create your product on the app.
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
            name="ShortDescription"
            placeholder="Short Description"
            value={formData.ShortDescription}
            onChange={handleChange}
          />

          <textarea
            name="LongDescription"
            placeholder="Long Description"
            value={formData.LongDescription}
            onChange={handleChange}
            rows={5}
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
            {image && (
              <img src={image} alt="Uploaded Preview" className="preview" />
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit">Add product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
