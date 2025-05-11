import React, { useState, useEffect } from "react";
import Course from "@/interfaces/course";
import { fetchCategories } from "@/api/category";
import Category from "@/interfaces/category";

interface CourseFormProps {
  initialData?: Partial<Course>;
  onSubmit: (data: Partial<Course>) => void;
  onCancel: () => void;
}

function CourseForm({ initialData = {}, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<Partial<Course>>(initialData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (["price", "newPrice", "categoryId", "creatorId", "teacherId"].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = "Tiêu đề không được để trống";
    if (!formData.price && formData.price !== 0) newErrors.price = "Giá không được để trống";
    if (!formData.categoryId) newErrors.categoryId = "Danh mục không được để trống";
    if (!formData.creatorId) newErrors.creatorId = "ID người tạo không được để trống";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } p-2`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price === undefined ? "" : formData.price}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.price ? "border-red-500" : "border-gray-300"
            } p-2`}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá mới</label>
          <input
            type="number"
            name="newPrice"
            value={formData.newPrice === undefined ? "" : formData.newPrice}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
        <select
          name="categoryId"
          value={formData.categoryId || ""}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.categoryId ? "border-red-500" : "border-gray-300"
          } p-2`}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID người tạo</label>
          <input
            type="number"
            name="creatorId"
            value={formData.creatorId === undefined ? "" : formData.creatorId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.creatorId ? "border-red-500" : "border-gray-300"
            } p-2`}
          />
          {errors.creatorId && <p className="text-red-500 text-xs mt-1">{errors.creatorId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ID giáo viên</label>
          <input
            type="number"
            name="teacherId"
            value={formData.teacherId === undefined ? "" : formData.teacherId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}

export default CourseForm;
