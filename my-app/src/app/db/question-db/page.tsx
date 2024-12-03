"use client";
import React, { useState, useEffect } from "react";
import DBTable from "@/components/dbTable";
import Question from "@/interfaces/question";

// Định nghĩa interface cho người dùng

function QuestionPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [content, setContent] = useState("");
    const [option, setOption] = useState("");
    const [answer, setAnswer] = useState("");
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(
        null
    ); // Dữ liệu user đang chỉnh sửa
    const [showEditModal, setShowEditModal] = useState(false);

    // Lấy danh sách người dùng từ backend
    const fetchQuestions = async () => {
        const response = await fetch("http://localhost:5000/questions");
        const data: Question[] = await response.json();
        setQuestions(data);
    };

    // Thêm người dùng mới
    const addQuestion = async () => {
        const response = await fetch("http://localhost:5000/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, option, answer }),
        });

        if (response.ok) {
            fetchQuestions();
            setContent("");
            setOption("");
            setAnswer("");
        } else {
            alert("Không thể thêm q.");
        }
    };

    const deleteQuestion = async (id: number) => {
        const response = await fetch(`http://localhost:5000/questions/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchQuestions();
        } else {
            alert("Không thể xóa.");
        }
    };

    // Bắt đầu chỉnh sửa
    const editQuestion = (question: Question) => {
        setEditingQuestion(question);
        setContent(question.content);
        setOption(question.options);
        setAnswer(question.answer);
        setShowEditModal(true);
    };

    const updateQuestion = async () => {
        if (editingQuestion) {
            const response = await fetch(
                `http://localhost:5000/users/${editingQuestion.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content, option, answer }),
                }
            );

            if (response.ok) {
                fetchQuestions();
                setEditingQuestion(null);
                setShowEditModal(false);
                setContent("");
                setOption("");
                setAnswer("");
            } else {
                alert("Không thể cập nhật.");
            }
        }
    };

    // Hiện thị Modal
    const renderEditModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Người Dùng</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="option"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>{" "}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    onClick={updateQuestion}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Cập nhật
                </button>
                <button
                    onClick={() => setShowEditModal(false)}
                    className="ml-2 bg-red-500 text-white px-4 py-1 rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );

    // Gọi hàm khi trang được load
    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Quản lý Questions</h1>

            <div className="my-4">
                <input
                    type="text"
                    placeholder="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="text"
                    placeholder="option"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className="border p-2 ml-2"
                />{" "}
                <input
                    type="text"
                    placeholder="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="border p-2 ml-2"
                />
                <button
                    onClick={addQuestion}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                >
                    Thêm Question
                </button>
            </div>

            {/* Danh sách người dùng */}
            <div className="container">
                <DBTable
                    data={questions}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "content", label: "Content" },
                        { key: "options", label: "Option" },
                        { key: "answer", label: "Answer" },
                        { key: "testId", label: "TestId" },
                    ]}
                    onEdit={editQuestion}
                    onDelete={deleteQuestion}
                />
            </div>

            {showEditModal && renderEditModal()}
        </div>
    );
}

export default QuestionPage;
