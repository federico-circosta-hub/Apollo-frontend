import { createContext, useCallback, useRef } from "react";
import AnnotationTool from "../../common/Model/AnnotationTool";
import CommunicationController from "../../common/Model/CommunicationController";

export const AnnotationToolsContext = createContext<{
    get: () => Promise<AnnotationTool[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: AnnotationTool) => Promise<void>;
}>({ get: async () => [], add: async () => {}, delete: async () => {} });

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


    const addTool = useCallback(async (tool: AnnotationTool) => {
        //const res = await CommunicationController.newDataset(dataset);
        tools.current.push(tool);
    }, []);

    const removeTool = useCallback(async (toolId: number) => {
        await CommunicationController.deleteAnnotationTool(toolId);
        tools.current = tools.current.filter((at) => at.id !== toolId);
    }, []);

    return (
        <AnnotationToolsContext.Provider value={{ get: getTools, add: addTool, delete: removeTool }}>
            {children}
        </AnnotationToolsContext.Provider>
    );
}
