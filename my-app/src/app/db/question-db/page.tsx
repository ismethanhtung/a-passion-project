// "use client";
// import React, { useState, useEffect } from "react";
// import DBTable from "@/components/dbTable";
// import Question from "@/interfaces/question";
// import { json } from "stream/consumers";

// function QuestionPage() {
//     const [questions, setQuestions] = useState<Question[]>([]);

//     const fetchQuestions = async () => {
//         const response = await fetch("http://localhost:5000/questions");
//         const data: Question[] = await response.json();
//         setQuestions(data);
//     };

//     const addQuestion = async () => {
//         const response = await fetch("http://localhost:5000/questions", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(template),
//         });

//         if (response.ok) {
//             fetchQuestions();
//             setJsonInput(template);
//         } else {
//             alert("Không thể thêm q.");
//         }
//     };

//     const deleteQuestion = async (id: number) => {
//         const response = await fetch(`http://localhost:5000/questions/${id}`, {
//             method: "DELETE",
//             credentials: "include",
//         });

//         if (response.ok) fetchQuestions();
//         else alert("Không thể xóa.");
//     };

//     const editQuestion = (question: Question) => {
//         setEditingQuestion(question);
//         setJsonInput(JSON.stringify(question, null, 2));
//         setShowEditModal(true);
//     };

//     const updateQuestion = async () => {
//         if (editingQuestion) {
//             const response = await fetch(
//                 `http://localhost:5000/users/${editingQuestion.id}`,
//                 {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(template),
//                 }
//             );

//             if (response.ok) {
//                 fetchQuestions();
//                 setEditingQuestion(null);
//                 setShowEditModal(false);
//                 setJsonInput(template);
//             } else {
//                 alert("Không thể cập nhật.");
//             }
//         }
//     };

//     useEffect(() => {
//         fetchQuestions();
//     }, []);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-xl font-bold">Quản lý Questions</h1>
//             <textarea
//                 value={jsonInput}
//                 onChange={(e) => setJsonInput(e.target.value)}
//                 className="border w-full p-2 h-32"
//             ></textarea>
//             <div className="my-4">
//                 <button
//                     onClick={addQuestion}
//                     className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
//                 >
//                     Thêm Question
//                 </button>
//             </div>
//             <div className="container">
//                 <DBTable
//                     data={questions}
//                     columns={[
//                         { key: "id", label: "ID" },
//                         { key: "content", label: "Content" },
//                         { key: "options", label: "Option" },
//                         { key: "answer", label: "Answer" },
//                         { key: "testId", label: "TestId" },
//                     ]}
//                     onEdit={editQuestion}
//                     onDelete={deleteQuestion}
//                 />
//             </div>

//             {showEditModal &&
//                 renderEditModal(
//                     jsonInput,
//                     setJsonInput,
//                     updateQuestion,
//                     setShowEditModal
//                 )}
//         </div>
//     );
// }

// export default QuestionPage;
