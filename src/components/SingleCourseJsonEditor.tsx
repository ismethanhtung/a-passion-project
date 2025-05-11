import React, { useState, useEffect } from "react";
import Course from "@/interfaces/course";

interface SingleCourseJsonEditorProps {
  course: Course;
  onSave: (updatedCourse: Course) => void;
  onCancel: () => void;
}

function SingleCourseJsonEditor({
  course,
  onSave,
  onCancel,
}: SingleCourseJsonEditorProps) {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJsonText(JSON.stringify(course, null, 2));
      setError(null);
    } catch (err) {
      setError("Không thể chuyển đổi dữ liệu thành JSON");
    }
  }, [course]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(jsonText);
      onSave(parsedData);
      setError(null);
    } catch (err) {
      setError("JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Chỉnh sửa khóa học (JSON)</h2>
      <div className="mb-4">
        <textarea
          className={`w-full h-96 p-4 border rounded-lg font-mono text-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={jsonText}
          onChange={handleTextChange}
          placeholder="Nhập dữ liệu JSON ở đây..."
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

export default SingleCourseJsonEditor;
