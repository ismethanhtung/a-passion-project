// "use client";

// import React, { useState, useEffect } from "react";

// interface UserSettings {
//     name: string;
//     email: string;
//     phone?: string;
//     language?: string;
//     notifications: {
//         email: boolean;
//         sms: boolean;
//         app: boolean;
//     };
//     learningGoals: number;
//     theme: string;
// }

// const Settings: React.FC = () => {
//     const [settings, setSettings] = useState<UserSettings | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const fetchSettings = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/settings");
//             if (!response.ok) throw new Error("Failed to fetch settings");
//             const data = await response.json();
//             setSettings(data);
//             setLoading(false);
//         } catch (err: any) {
//             setError(err.message);
//             setLoading(false);
//         }
//     };

//     const updateSettings = async (updatedSettings: UserSettings) => {
//         try {
//             const response = await fetch("http://localhost:5000/settings", {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(updatedSettings),
//             });
//             if (!response.ok) throw new Error("Failed to update settings");
//             setSettings(updatedSettings);
//             alert("Cài đặt đã được lưu!");
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     const handleSave = () => {
//         if (settings) updateSettings(settings);
//     };

//     useEffect(() => {
//         fetchSettings();
//     }, []);

//     if (loading) return <div>Đang tải...</div>;
//     if (error) return <div className="text-red-500">{error}</div>;

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-4">Cài đặt</h1>

//             <div className="bg-gray-100 p-4 rounded-lg mb-6">
//                 <h2 className="text-xl font-semibold mb-3">
//                     Thông tin cá nhân
//                 </h2>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium">
//                             Tên:
//                         </label>
//                         <input
//                             type="text"
//                             value={settings?.name}
//                             onChange={(e) =>
//                                 setSettings({
//                                     ...settings!,
//                                     name: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium">
//                             Email:
//                         </label>
//                         <input
//                             type="email"
//                             value={settings?.email}
//                             disabled
//                             className="w-full p-2 border rounded bg-gray-200"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium">
//                             Số điện thoại:
//                         </label>
//                         <input
//                             type="text"
//                             value={settings?.phone || ""}
//                             onChange={(e) =>
//                                 setSettings({
//                                     ...settings!,
//                                     phone: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Cài đặt học tập */}
//             <div className="bg-gray-100 p-4 rounded-lg mb-6">
//                 <h2 className="text-xl font-semibold mb-3">Cài đặt học tập</h2>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium">
//                             Mục tiêu học tập (phút mỗi ngày):
//                         </label>
//                         <input
//                             type="number"
//                             value={settings?.learningGoals}
//                             onChange={(e) =>
//                                 setSettings({
//                                     ...settings!,
//                                     learningGoals:
//                                         parseInt(e.target.value) || 0,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium">
//                             Ngôn ngữ:
//                         </label>
//                         <select
//                             value={settings?.language}
//                             onChange={(e) =>
//                                 setSettings({
//                                     ...settings!,
//                                     language: e.target.value,
//                                 })
//                             }
//                             className="w-full p-2 border rounded"
//                         >
//                             <option value="vi">Tiếng Việt</option>
//                             <option value="en">English</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Thông báo */}
//             <div className="bg-gray-100 p-4 rounded-lg mb-6">
//                 <h2 className="text-xl font-semibold mb-3">Thông báo</h2>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 checked={settings?.notifications.email}
//                                 onChange={(e) =>
//                                     setSettings({
//                                         ...settings!,
//                                         notifications: {
//                                             ...settings!.notifications,
//                                             email: e.target.checked,
//                                         },
//                                     })
//                                 }
//                                 className="form-checkbox"
//                             />
//                             <span>Nhận thông báo qua Email</span>
//                         </label>
//                     </div>
//                     <div>
//                         <label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 checked={settings?.notifications.sms}
//                                 onChange={(e) =>
//                                     setSettings({
//                                         ...settings!,
//                                         notifications: {
//                                             ...settings!.notifications,
//                                             sms: e.target.checked,
//                                         },
//                                     })
//                                 }
//                                 className="form-checkbox"
//                             />
//                             <span>Nhận thông báo qua SMS</span>
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-gray-100 p-4 rounded-lg mb-6">
//                 <h2 className="text-xl font-semibold mb-3">Giao diện</h2>
//                 <div>
//                     <label className="block text-sm font-medium">Chế độ:</label>
//                     <select
//                         value={settings?.theme}
//                         onChange={(e) =>
//                             setSettings({ ...settings!, theme: e.target.value })
//                         }
//                         className="w-full p-2 border rounded"
//                     >
//                         <option value="light">Sáng</option>
//                         <option value="dark">Tối</option>
//                     </select>
//                 </div>
//             </div>

//             <button
//                 onClick={handleSave}
//                 className="w-full bg-blue-500 text-white p-3 rounded-lg"
//             >
//                 Lưu cài đặt
//             </button>
//         </div>
//     );
// };

// export default Settings;
