// "use client";
// import React, { useState, useEffect } from "react";
// import DBTable from "@/components/dbTable";
// import Blog from "@/interfaces/blog";
// import { fetchCategories, addBlog, deleteBlog, updateBlog } from "@/utils/blogs";

// function BlogPage() {
//     const [categories, setCategories] = useState<Blog[]>([]);

//     const getCategories = async () => {
//         const response = await fetchCategories();
//         setCategories(response);
//     };

//     const handleAddBlog = async (newBlog: Partial<Blog>) => {
//         try {
//             await addBlog(newBlog);
//             getCategories();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleDeleteBlog = async (id: number) => {
//         try {
//             await deleteBlog(id);
//             getCategories();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleUpdateBlog = async (updatedBlog: Blog) => {
//         try {
//             await updateBlog(updatedBlog.id, updatedBlog);
//             getCategories();
//         } catch (error) {
//             alert("Dữ liệu JSON không hợp lệ.");
//         }
//     };

//     useEffect(() => {
//         getCategories();
//     }, []);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-xl font-bold mb-8">Categories management</h1>

//             <div className="container">
//                 <DBTable
//                     data={categories}
//                     columns={[{ key: "id" }, { key: "name" }, { key: "parentId" }]}
//                     onCreate={handleAddBlog}
//                     onUpdate={handleUpdateBlog}
//                     onDelete={handleDeleteBlog}
//                 />
//             </div>
//         </div>
//     );
// }

// export default BlogPage;
