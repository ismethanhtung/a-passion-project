/**
 * Service kiểm tra và gửi thông báo nhắc nhở đăng ký khóa học cho lộ trình
 */

import prisma from "@/lib/prisma";
import { addNotification } from "@/api/notification";

interface PathCourseStatus {
    pathId: number;
    userId: number;
    courseId: number;
    courseName: string;
    isEnrolled: boolean;
    priority: number;
    daysFromCreation: number;
}

export class LearningPathReminderService {
    private static instance: LearningPathReminderService;

    private constructor() {}

    public static getInstance(): LearningPathReminderService {
        if (!LearningPathReminderService.instance) {
            LearningPathReminderService.instance =
                new LearningPathReminderService();
        }
        return LearningPathReminderService.instance;
    }

    /**
     * Kiểm tra tất cả các lộ trình và gửi thông báo nếu cần thiết
     */
    public async checkAllPathsAndNotify(): Promise<number> {
        try {
            // Lấy tất cả các lộ trình có khóa học được đề xuất và đã tạo ít nhất 1 ngày
            const paths = await prisma.learningPath.findMany({
                where: {
                    recommendedCourses: {
                        some: {
                            isEnrolled: false, // Chỉ lấy những lộ trình có khóa học chưa đăng ký
                        },
                    },
                    createdAt: {
                        lte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ít nhất 1 ngày trước
                    },
                },
                include: {
                    user: true,
                    recommendedCourses: {
                        include: {
                            course: true,
                        },
                    },
                },
            });

            console.log(`Đã tìm thấy ${paths.length} lộ trình cần kiểm tra`);

            let notificationCount = 0;

            for (const path of paths) {
                // Tính số ngày kể từ khi tạo lộ trình
                const daysFromCreation = Math.floor(
                    (Date.now() - path.createdAt.getTime()) /
                        (24 * 60 * 60 * 1000)
                );

                // Kiểm tra xem đã gửi nhắc nhở quá 3 lần chưa
                if (path.reminderCount >= 3) {
                    continue;
                }

                // Kiểm tra xem đã đến lúc gửi nhắc nhở chưa (dựa trên lần nhắc nhở cuối)
                const lastReminderDays = path.lastReminderSent
                    ? Math.floor(
                          (Date.now() - path.lastReminderSent.getTime()) /
                              (24 * 60 * 60 * 1000)
                      )
                    : daysFromCreation;

                // Chỉ gửi nhắc nhở nếu đã qua ít nhất 1 ngày kể từ lần nhắc nhở cuối
                // hoặc chưa từng gửi nhắc nhở
                if (path.lastReminderSent && lastReminderDays < 1) {
                    continue;
                }

                // Lọc ra các khóa học chưa đăng ký
                const unenrolledCourses = path.recommendedCourses.filter(
                    (rc) => !rc.isEnrolled
                );

                if (unenrolledCourses.length > 0) {
                    // Sắp xếp theo độ ưu tiên
                    unenrolledCourses.sort((a, b) => a.priority - b.priority);

                    // Xác định loại nhắc nhở dựa vào số ngày kể từ khi tạo lộ trình
                    let notificationMessage = "";

                    if (daysFromCreation <= 1 && path.reminderCount === 0) {
                        // Nhắc nhở lần đầu (ngày thứ 1)
                        notificationMessage = `Chào ${
                            path.user.name || "bạn"
                        }, bạn đã tạo lộ trình học tập nhưng chưa đăng ký khóa học nào. Đề xuất của chúng tôi là: "${
                            unenrolledCourses[0].course.title
                        }". Hãy xem ngay!`;
                    } else if (
                        daysFromCreation >= 3 &&
                        path.reminderCount === 1
                    ) {
                        // Nhắc nhở lần thứ 2 (sau 3 ngày)
                        notificationMessage = `Đã 3 ngày kể từ khi bạn tạo lộ trình học tập. Đừng bỏ lỡ cơ hội học tập với ${unenrolledCourses.length} khóa học phù hợp với bạn. Bạn có thể đăng ký ngay hoặc tạo lộ trình mới!`;
                    } else if (
                        daysFromCreation >= 7 &&
                        path.reminderCount === 2
                    ) {
                        // Nhắc nhở lần cuối (sau 7 ngày)
                        notificationMessage = `Lộ trình học tập của bạn đã được tạo 1 tuần. Bạn vẫn chưa đăng ký khóa học nào. Hãy xem lại lộ trình hoặc tạo một lộ trình mới phù hợp hơn!`;
                    }

                    // Gửi thông báo nếu có nội dung
                    if (notificationMessage) {
                        try {
                            await addNotification({
                                userId: path.userId,
                                message: notificationMessage,
                                type: "learning_path_reminder",
                                data: JSON.stringify({
                                    pathId: path.id,
                                    courseIds: unenrolledCourses.map(
                                        (c) => c.courseId
                                    ),
                                    reminderCount: path.reminderCount + 1,
                                }),
                            });

                            // Cập nhật thông tin nhắc nhở của lộ trình
                            await prisma.learningPath.update({
                                where: { id: path.id },
                                data: {
                                    lastReminderSent: new Date(),
                                    reminderCount: path.reminderCount + 1,
                                },
                            });

                            notificationCount++;
                            console.log(
                                `Đã gửi nhắc nhở cho user ${path.userId} về lộ trình ${path.id}`
                            );
                        } catch (error) {
                            console.error(
                                `Lỗi khi gửi thông báo cho user ${path.userId}:`,
                                error
                            );
                        }
                    }
                }
            }

            return notificationCount;
        } catch (error) {
            console.error("Lỗi khi kiểm tra lộ trình:", error);
            throw error;
        }
    }

    /**
     * Kiểm tra xem người dùng đã đăng ký các khóa học trong lộ trình chưa
     */
    public async updateEnrollmentStatus(): Promise<number> {
        try {
            // Lấy tất cả các đề xuất khóa học chưa được đánh dấu là đã đăng ký
            const pathCourses = await prisma.learningPathCourse.findMany({
                where: {
                    isEnrolled: false,
                },
                include: {
                    path: true,
                },
            });

            let updatedCount = 0;

            for (const pathCourse of pathCourses) {
                // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
                const enrollment = await prisma.enrollment.findFirst({
                    where: {
                        userId: pathCourse.path.userId,
                        courseId: pathCourse.courseId,
                    },
                });

                if (enrollment) {
                    // Cập nhật trạng thái đăng ký
                    await prisma.learningPathCourse.update({
                        where: {
                            id: pathCourse.id,
                        },
                        data: {
                            isEnrolled: true,
                            enrolledAt: enrollment.enrolledAt,
                        },
                    });

                    updatedCount++;
                }
            }

            return updatedCount;
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đăng ký:", error);
            throw error;
        }
    }

    /**
     * Lấy trạng thái đăng ký khóa học trong lộ trình của một người dùng
     */
    public async getPathCoursesStatus(
        userId: number,
        pathId?: number
    ): Promise<PathCourseStatus[]> {
        try {
            // Xây dựng điều kiện truy vấn
            const whereCondition: any = {
                userId: userId,
            };

            if (pathId) {
                whereCondition.id = pathId;
            }

            // Lấy thông tin lộ trình và các khóa học liên quan
            const paths = await prisma.learningPath.findMany({
                where: whereCondition,
                include: {
                    recommendedCourses: {
                        include: {
                            course: true,
                        },
                    },
                },
            });

            const result: PathCourseStatus[] = [];

            for (const path of paths) {
                // Tính số ngày kể từ khi tạo lộ trình
                const daysFromCreation = Math.floor(
                    (Date.now() - path.createdAt.getTime()) /
                        (24 * 60 * 60 * 1000)
                );

                // Thêm thông tin về từng khóa học
                for (const rc of path.recommendedCourses) {
                    result.push({
                        pathId: path.id,
                        userId: userId,
                        courseId: rc.courseId,
                        courseName:
                            rc.course.title || `Khóa học #${rc.courseId}`,
                        isEnrolled: rc.isEnrolled,
                        priority: rc.priority,
                        daysFromCreation,
                    });
                }
            }

            return result;
        } catch (error) {
            console.error("Lỗi khi lấy trạng thái khóa học:", error);
            throw error;
        }
    }
}

export default LearningPathReminderService;
