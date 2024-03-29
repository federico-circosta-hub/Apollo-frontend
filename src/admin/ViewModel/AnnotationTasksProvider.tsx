import { createContext, useCallback, useRef } from "react";
import Task, { TaskData } from "../../common/Model/Task";
import CommunicationController from "../../common/Model/Communication/MainCommunicationController";

export const AnnotationTasksContext = createContext<{
    get: () => Promise<Task[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: TaskData) => Promise<Task | undefined>;
}>({
    get: async () => [],
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
            let res = await CommunicationController.getAllTasks(true);
            synchronized.current = true;

            res = res.filter(
                (t1) =>
                    tasks.current.find((t2) => t1.id === t2.id) === undefined
            );

            tasks.current.push(...res);
            tasks.current.sort((t1, t2) => t1.name().localeCompare(t2.name()));
        }
        return tasks.current;
    }, []);

    const addTask = useCallback(async (data: TaskData) => {
        data = {
            ...data,
            physicians: data.physicians.filter((p) => p.assign),
        };
        const task = await CommunicationController.newAnnotationTask(data);
        tasks.current.push(task);
        tasks.current.sort((t1, t2) => t1.name().localeCompare(t2.name()));
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
                add: addTask,
                delete: removeTask,
            }}
        >
            {children}
        </AnnotationTasksContext.Provider>
    );
}
