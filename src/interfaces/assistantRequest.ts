import User from "./user";
import AssistantLog from "./assistantLog";

interface AssistantRequest {
    id: number;
    userId: number;
    request: string;
    response: string;
    status: string;
    createdAt: string;
    user: User;
    assistantLogs: AssistantLog[];
}

export default AssistantRequest;
