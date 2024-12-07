const renderEditModal = (jsonInput, setJsonInput, update, setShowEditModal) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white w-3/6 h-3/6 p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Chỉnh Sửa</h2>
            <div className="mb-4">
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="border w-full p-2 h-64"
                ></textarea>
            </div>
            <button
                onClick={update}
                className="bg-blue-500 text-white px-4 py-1 rounded"
            >
                Update
            </button>
            <button
                onClick={() => setShowEditModal(false)}
                className="ml-2 bg-red-500 text-white px-4 py-1 rounded"
            >
                Esc
            </button>
        </div>
    </div>
);

export default renderEditModal;
