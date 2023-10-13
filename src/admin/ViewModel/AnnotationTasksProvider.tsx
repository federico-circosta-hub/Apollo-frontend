import { createContext, useCallback, useRef } from "react";
import Task, { TaskData } from "../../common/Model/Task";
import CommunicationController from "../../common/Model/CommunicationController";

export const AnnotationTasksContext = createContext<{
    get: () => Promise<Task[]>;
    update: (offset: number) => Promise<Task[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: TaskData) => Promise<Task | undefined>;
}>({
    get: async () => [],
    update: async () => [],
    add: async () => {
        return undefined;
    },
    delete: async () => {},
});

export default function AnnotationToolsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const synchronized = useRef<boolean>(false);
    const tasks = useRef<Task[]>([]);

    const getTasks = useCallback(async () => {
        if (!synchronized.current) {
            const res = await CommunicationController.getAllTasks(true);
            synchronized.current = true;
            tasks.current.push(...res);
        }
        return tasks.current;
    }, []);

    const updateTasks = useCallback(async (offset: number) => {
        const res = await CommunicationController.getAllTasks(true, offset);
        tasks.current.push(...res);
        return res;
    }, []);

    const addTask = useCallback(async (data: TaskData) => {
        data = {
            ...data,
            physicians: data.physicians.filter((p) => p.assign),
        };
        const task = await CommunicationController.newAnnotationTask(data);
        tasks.current.push(task);
        return task;
    }, []);

    const removeTask = useCallback(async (taskId: number) => {
        await CommunicationController.deleteAnnotationTask(taskId);
        tasks.current = tasks.current.filter((at) => at.id !== taskId);
    }, []);

    return (
        <AnnotationTasksContext.Provider
            value={{
                get: getTasks,
                update: updateTasks,
                add: addTask,
                delete: removeTask,
            }}
        >
            {children}
        </AnnotationTasksContext.Provider>
    );
}
