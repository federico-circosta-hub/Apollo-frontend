import Task from "../../../common/Model/Task";
import { DetailItemProps } from "../MasterDetail/DetailComponent";
import { useCallback, useContext, useEffect, useState } from "react";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";
import User from "../../../common/Model/User";
import Status from "../../../common/Model/Status";
import LoadingSpinner from "../../../common/View/LoadingSpinner";
import ErrorScreen from "../../../common/View/ErrorScreen";
import TaskDetailsForm from "./TaskDetailsForm";

export default function AnnotationTaskDetails({ item }: DetailItemProps) {
    const task = item as Task;

    const hasUserAccessToTool = useCallback(
        (user: User): boolean => {
            // Assume che sia già stata chiamato il metodo fetchToolsAccess di User
            return (
                user.toolsAccess.find(
                    (t) => t.id === task.annotation_tool && t.access
                ) !== undefined
            );
        },
        [task]
    );

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const { getWithTools: getUsers } = useContext(PhysiciansContext);
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getUsers();
            setUsers(res.filter(hasUserAccessToTool));

            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getUsers, hasUserAccessToTool]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (status === Status.LOADING) return <LoadingSpinner />;

    if (status === Status.ERROR) return <ErrorScreen onRetry={fetchData} />;

    return <TaskDetailsForm task={task} users={users} />;
}
