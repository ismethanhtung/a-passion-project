import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint để chuyển văn bản thành âm thanh
 */
export async function POST(req: NextRequest) {
    try {
        const { text, voice = "en-US", rate = 1, pitch = 1 } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Cần cung cấp văn bản hợp lệ" },
                { status: 400 }
            );
        }

        // Tạo response audio cho client
        return NextResponse.json({
            success: true,
            text,
            voiceParams: {
                voice,
                rate,
                pitch,
            },
            message: "Sử dụng Web Speech API ở client để phát âm thanh",
        });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý text-to-speech:", error);
        return NextResponse.json(
            {
                error: "Lỗi khi xử lý yêu cầu text-to-speech",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
