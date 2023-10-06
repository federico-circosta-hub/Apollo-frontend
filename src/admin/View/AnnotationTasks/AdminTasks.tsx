import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import Task from "../../../common/Model/Task";
import CommunicationController from "../../../common/Model/CommunicationController";
import MasterDetail from "../MasterDetail/MasterDetail";
import { MasterItemProps } from "../MasterDetail/MasterComponent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AnnotationTasksContext } from "../../ViewModel/AnnotationTasksProvider";
import AnnotationTaskDetails from "./AnnotationTaskDetails";

export default function AdminTasks() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Task di annotazione");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const { get: getTasks, delete: deleteTask } = useContext(
        AnnotationTasksContext
    );
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getTasks();
            res.sort((a, b) => a.name().localeCompare(b.name()));

            console.log(`${res.length} annotation tasks recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getTasks]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    const handleDelete = useCallback(
        async (task: Task) => {
            await deleteTask(task.id);
            await fetchData();
            return;
        },
        [deleteTask, fetchData]
    );

    return (
        <MasterDetail
            items={tasks}
            itemName="Task"
            addRoute="/tasks/add"
            status={status}
            MasterItem={AnnotationTaskItem}
            DetailItem={AnnotationTaskDetails}
            onRetry={fetchData}
            onDelete={handleDelete}
            deleteText="Non è possibile eliminare un task di annotazione se vi sono già delle annotazioni associate."
        />
    );
}

const AnnotationTaskItem = ({ item, onClick, onDelete }: MasterItemProps) => {
    const task = item as Task;

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText primary={task.name()} />
            <ListItemIcon
                sx={{ display: "flex", flexDirection: "row-reverse" }}
            >
                <IconButton onClick={onDelete}>
                    <DeleteForeverIcon color="error" />
                </IconButton>
            </ListItemIcon>
        </ListItemButton>
    );
};
