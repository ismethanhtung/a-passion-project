import React, { useState, useEffect } from "react";

interface JsonEditorProps<T> {
  data: T | T[];
  onSave: (data: T | T[]) => void;
  isMultiple?: boolean;
  placeholder?: string;
}

function JsonEditor<T>({
  data,
  onSave,
  isMultiple = false,
  placeholder = "Nhập dữ liệu JSON ở đây...",
}: JsonEditorProps<T>) {
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setJsonText(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err) {
      setError("Không thể chuyển đổi dữ liệu thành JSON");
    }
  }, [data]);

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
    <div className="w-full">
      <div className="mb-4">
        <textarea
          className={`w-full h-96 p-4 border rounded-lg font-mono text-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          value={jsonText}
          onChange={handleTextChange}
          placeholder={placeholder}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

export default JsonEditor;
