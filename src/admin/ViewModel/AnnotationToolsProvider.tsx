import { createContext, useCallback, useRef } from "react";
import AnnotationTool from "../../common/Model/AnnotationTool";
import CommunicationController from "../../common/Model/Communication";

export const AnnotationToolsContext = createContext<
    () => Promise<AnnotationTool[]>
>(async () => []);

export default function AnnotationToolsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const tools = useRef<AnnotationTool[]>([]);

    const getTools = useCallback(async () => {
        if (tools.current.length === 0) {
            const res = await CommunicationController.getAnnotationTools();
            tools.current = res;
        }
        return tools.current;
    }, []);

    return (
        <AnnotationToolsContext.Provider value={getTools}>
            {children}
        </AnnotationToolsContext.Provider>
    );
}
