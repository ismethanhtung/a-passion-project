const removeVietnameseDiacritics = (str: string): string => {
    return str
        .normalize("NFD") // Tách dấu khỏi ký tự gốc
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
        .replace(/đ/g, "d") // Chuyển "đ" thành "d"
        .replace(/Đ/g, "D"); // Chuyển "Đ" thành "D"
};
const isCourseQuery = (message: any) => {
    const normalizedMessage = removeVietnameseDiacritics(message.normalize("NFC").toLowerCase());
    console.log(normalizedMessage);
    const keywords = ["khoa hoc", "docs", "tài liệu", "test", "bài kiểm tra"];
    return keywords.some((keyword) => normalizedMessage.includes(keyword));
};
