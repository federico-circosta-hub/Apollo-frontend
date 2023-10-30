import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import Task from "../../../common/Model/Task";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import MasterDetail from "../MasterDetail/MasterDetail";
import { MasterItemProps } from "../MasterDetail/MasterComponent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AnnotationTasksContext } from "../../ViewModel/AnnotationTasksProvider";
import AnnotationTaskDetails from "./TaskDetails";

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

    const [, setTitle] = useContext(HeaderContext);

    const handleClick = useCallback(() => {
        setTitle(task.name());
        onClick();
    }, [setTitle, task, onClick]);

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemText
                primary={task.dataset_name}
                secondary={task.annotation_type_name}
            />
            <ListItemText
                primary={`${task.overallProgress() * 100}%`}
                secondary={
                    task.media_count + (task.type ? " immagini" : " video")
                }
                sx={{ textAlign: "right" }}
            />
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
