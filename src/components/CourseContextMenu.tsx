import React, { useState, useRef, useEffect } from "react";
import Course from "@/interfaces/course";

interface CourseContextMenuProps {
  course: Course;
  onEditForm: (course: Course) => void;
  onEditJson: (course: Course) => void;
  onDelete: (id: number) => void;
  onExport: (course: Course) => void;
}

function CourseContextMenu({
  course,
  onEditForm,
  onEditJson,
  onDelete,
  onExport,
}: CourseContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditForm = () => {
    onEditForm(course);
    setIsOpen(false);
  };

  const handleEditJson = () => {
    onEditJson(course);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}" không?`)) {
      onDelete(course.id);
    }
    setIsOpen(false);
  };

  const handleExport = () => {
    onExport(course);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={handleEditForm}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Chỉnh sửa (Form)
            </button>
            <button
              onClick={handleEditJson}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Chỉnh sửa (JSON)
            </button>
            <button
              onClick={handleExport}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Xuất JSON
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseContextMenu;
