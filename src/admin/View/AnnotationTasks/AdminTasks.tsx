import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
    const waitingUpdate = useRef(false);
    const allGot = useRef(false);

    const {
        get: getTasks,
        delete: deleteTask,
        update: updateTasks,
    } = useContext(AnnotationTasksContext);
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getTasks();

            console.log(`${res.length} annotation tasks recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
            allGot.current = false;
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getTasks]);

    const handleUpdate = useCallback(async () => {
        if (allGot.current || waitingUpdate.current) return;
        waitingUpdate.current = true;

        try {
            const res = await updateTasks(tasks.length);

            const newTasks = res.filter(
                (task) => tasks.find((t) => t.id === task.id) === undefined
            );

            waitingUpdate.current = false;
            if (newTasks.length === 0) {
                allGot.current = true;
                return;
            }

            setTasks((prev) => [...prev, ...newTasks]);
        } catch (err: any) {
            waitingUpdate.current = false;
            setStatus(Status.ERROR);
        }
    }, [tasks, updateTasks]);

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
            onScroll={handleUpdate}
        />
    );
}

const AnnotationTaskItem = ({ item, onClick, onDelete }: MasterItemProps) => {
    const task = item as Task;

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText
                primary={task.dataset_name}
                secondary={task.annotation_type_name}
            />
            <ListItemText
                primary={`${task.overallProgress()}%`}
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
