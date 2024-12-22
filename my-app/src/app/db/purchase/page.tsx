// "use client";
// import React, { useState, useEffect } from "react";
// import DBTable from "@/components/dbTable";
// import Purchase from "@/interfaces/purchase";
// import { fetchPurchases, addPurchase, deletePurchase, updatePurchase } from "@/api/purchase";

// function PurchasePage() {
//     const [purchases, setPurchases] = useState<Purchase[]>([]);

//     const getPurchases = async () => {
//         try {
//             const response = await fetchPurchases();
//             setPurchases(response);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleAddPurchase = async (newPurchase: Partial<Purchase>) => {
//         try {
//             await addPurchase(newPurchase);
//             getPurchases();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleDeletePurchase = async (id: number) => {
//         try {
//             await deletePurchase(id);
//             console.log(11);
//             getPurchases();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleUpdatePurchase = async (updatedPurchase: Purchase) => {
//         try {
//             await updatePurchase(updatedPurchase.id, updatedPurchase);
//             getPurchases();
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getPurchases();
//     }, []);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-xl font-bold py-8">Purchases management</h1>

//             <div className="container">
//                 <DBTable
//                     data={purchases}
//                     columns={[
//                         { key: "id",  },
//
//                     ]}
//                     onCreate={handleAddPurchase}
//                     onUpdate={handleUpdatePurchase}
//                     onDelete={handleDeletePurchase}
//                 />
//             </div>
//         </div>
//     );
// }

// export default PurchasePage;
