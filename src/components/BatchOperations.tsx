import React, { useState } from "react";
import Course from "@/interfaces/course";

interface BatchOperationsProps {
  onImport: (courses: Partial<Course>[]) => void;
  onExport: () => void;
}

function BatchOperations({ onImport, onExport }: BatchOperationsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file JSON để nhập");
      return;
    }

    try {
      const fileContent = await file.text();
      const parsedData = JSON.parse(fileContent);
      
      if (!Array.isArray(parsedData)) {
        setError("File phải chứa một mảng các khóa học");
        return;
      }
      
      onImport(parsedData);
      setError(null);
      setFile(null);
    } catch (err) {
      setError("Không thể đọc file JSON. Vui lòng kiểm tra định dạng file.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Thao tác hàng loạt</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Nhập khóa học từ file JSON</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="border border-gray-300 rounded p-2"
          />
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Nhập
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {file && <p className="text-gray-600 mt-2">File đã chọn: {file.name}</p>}
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Xuất khóa học ra file JSON</h3>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Xuất tất cả khóa học
        </button>
      </div>
    </div>
  );
}

export default BatchOperations;
