import React, { useState } from "react";
import Course from "@/interfaces/course";

interface BulkJsonImportProps {
  onImport: (courses: Partial<Course>[]) => void;
  onCancel: () => void;
}

function BulkJsonImport({ onImport, onCancel }: BulkJsonImportProps) {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError(null);
  };

  const handleImport = () => {
    try {
      if (!jsonText.trim()) {
        setError("Vui lòng nhập dữ liệu JSON");
        return;
      }

      const parsedData = JSON.parse(jsonText);
      
      if (!Array.isArray(parsedData)) {
        // Try to wrap as array if it's a single object
        if (typeof parsedData === 'object' && parsedData !== null) {
          onImport([parsedData]);
        } else {
          setError("Dữ liệu phải là một mảng các khóa học hoặc một khóa học");
        }
        return;
      }
      
      onImport(parsedData);
    } catch (err) {
      setError("JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.");
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setJsonText(clipboardText);
      setError(null);
    } catch (err) {
      setError("Không thể đọc dữ liệu từ clipboard");
    }
  };

  const handleClear = () => {
    setJsonText("");
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Nhập khóa học từ JSON</h2>
      
      <div className="mb-4">
        <div className="flex justify-end space-x-2 mb-2">
          <button
            onClick={handlePaste}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Dán
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Xóa
          </button>
        </div>
        
        <textarea
          className={`w-full h-96 p-4 border rounded-lg font-mono text-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={jsonText}
          onChange={handleTextChange}
          placeholder="Dán hoặc nhập dữ liệu JSON ở đây..."
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
          onClick={handleImport}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Nhập
        </button>
      </div>
    </div>
  );
}

export default BulkJsonImport;
