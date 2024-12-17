// "use client";
// import React, { useState, useEffect } from "react";
// import DBTable from "@/components/dbTable";
// import StudyTime from "@/interfaces/studyTime";
// import { fetchStudyTimes, addStudyTime, deleteStudyTime, updateStudyTime } from "@/utils/studyTime";

// function StudyTimePage() {
//     const [studyTimes, setStudyTimes] = useState<StudyTime[]>([]);

//     const getStudyTimes = async () => {
//         try {
//             const response = await fetchStudyTimes();
//             setStudyTimes(response);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleAddStudyTime = async (newStudyTime: Partial<StudyTime>) => {
//         try {
//             await addStudyTime(newStudyTime);
//             getStudyTimes();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleDeleteStudyTime = async (id: number) => {
//         try {
//             await deleteStudyTime(id);
//             console.log(11);
//             getStudyTimes();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleUpdateStudyTime = async (updatedStudyTime: StudyTime) => {
//         try {
//             await updateStudyTime(updatedStudyTime.id, updatedStudyTime);
//             getStudyTimes();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getStudyTimes();
//     }, []);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-xl font-bold py-8">StudyTimes management</h1>

//             <div className="container">
//                 <DBTable
//                     data={studyTimes}
//                     columns={[{ key: "id" }]}
//                     onCreate={handleAddStudyTime}
//                     onUpdate={handleUpdateStudyTime}
//                     onDelete={handleDeleteStudyTime}
//                 />
//             </div>
//         </div>
//     );
// }

// export default StudyTimePage;
