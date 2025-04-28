import AssistantRequest from "./assistantRequest";

interface AssistantLog {
    id: number;
    requestId: number;
    logMessage: string;
    timestamp: string;
    request: AssistantRequest;
}

export default AssistantLog;
