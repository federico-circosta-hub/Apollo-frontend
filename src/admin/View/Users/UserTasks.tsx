import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import PhysicianTask from "../../../common/Model/PhysicianTask";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/CommunicationController";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import LoadingError from "../../../common/View/LoadingError";

export default function UserTasks({ user }: { user: User }) {
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);

    const [includeCompleted, setIncludeCompleted] = useState(false);
    const [status, setStatus] = useState<Status>(Status.LOADING);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await user!.tasks(includeCompleted);

            console.log(`${res.length} task recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [user, includeCompleted]);

    useEffect(() => {
        fetchData();

        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE) {
        return (
            <LoadingError
                status={status}
                errorMsg="Errore nel caricamento dei task di annotazione"
                onReload={fetchData}
            />
        );
    }

    return (
        <Box sx={style.box}>
            <Box sx={style.headerBox}>
                <Typography variant="h5">
                    Task di annotazione assegnati:
                </Typography>
                <Box sx={{ flex: 1 }} />
                <FormControlLabel
                    style={{ margin: "auto" }}
                    control={
                        <Switch
                            checked={includeCompleted}
                            onChange={() =>
                                setIncludeCompleted(!includeCompleted)
                            }
                        />
                    }
                    label="Includi task completati"
                />
            </Box>
            {tasks.length === 0 ? (
                <Typography variant="h6">
                    Nessun task di annotazione assegnato
                </Typography>
            ) : (
                <TasksList tasks={tasks} />
            )}
        </Box>
    );
}

const TasksList = ({ tasks }: { tasks: PhysicianTask[] }) => {
    return (
        <List sx={style.scrollable}>
            {tasks.map((task) => (
                <Box key={task.id}>
                    <TaskItem task={task} />
                    <Divider sx={{ backgroundColor: "black" }} />
                </Box>
            ))}
        </List>
    );
};

const TaskItem = ({ task }: { task: PhysicianTask }) => {
    const navigate = useNavigate();

    const navigateToTask = useCallback(() => {
        navigate("/admin/tasks/?id=" + task.id);
    }, [navigate, task.id]);

    return (
        <ListItemButton onClick={navigateToTask}>
            <ListItemText
                primary={task.name()}
                secondary={`Deadline: ${task.deadline}`}
            />
            <ListItemText
                primary={`${task.annotated_media}/${task.media_count}`}
                primaryTypographyProps={{ align: "right" }}
            />
        </ListItemButton>
    );
};

const style = {
    box: {
        maxHeight: "35%",
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        margin: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
    headerBox: {
        flex: 1,
        display: "flex",
        flexDirection: "row" as "row",
    },
};
