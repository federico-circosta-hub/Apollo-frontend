import { createContext, useCallback, useRef } from "react";
import AnnotationTool, {
    AnnotationToolData,
} from "../../common/Model/AnnotationTool";
import CommunicationController from "../../common/Model/CommunicationController";

export const AnnotationToolsContext = createContext<{
    get: () => Promise<AnnotationTool[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: AnnotationToolData) => Promise<AnnotationTool | undefined>;
    getWithTypes: () => Promise<AnnotationTool[]>;
}>({
    get: async () => [],
    add: async () => {
        return undefined;
    },
    delete: async () => {},
    getWithTypes: async () => [],
});

export default function AnnotationToolsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const synchronized = useRef<boolean>(false);
    const tools = useRef<AnnotationTool[]>([]);

    const getTools = useCallback(async () => {
        if (!synchronized.current) {
            const res = await CommunicationController.getAnnotationTools();
            synchronized.current = true;
            tools.current.push(...res);
        }
        return tools.current;
    }, []);

    const addTool = useCallback(async (data: AnnotationToolData) => {
        const tool = await CommunicationController.newAnnotationTool(data);
        tools.current.push(tool);
        return tool;
    }, []);

    const removeTool = useCallback(async (toolId: number) => {
        await CommunicationController.deleteAnnotationTool(toolId);
        tools.current = tools.current.filter((at) => at.id !== toolId);
    }, []);

    const getWithTypes = useCallback(async () => {
        await getTools();

        const promises = [];
        for (const tool of tools.current) promises.push(tool.fetchTypes());

        await Promise.all(promises);

        return tools.current;
    }, [getTools]);

    return (
        <AnnotationToolsContext.Provider
            value={{
                get: getTools,
                add: addTool,
                delete: removeTool,
                getWithTypes,
            }}
        >
            {children}
        </AnnotationToolsContext.Provider>
    );
}
