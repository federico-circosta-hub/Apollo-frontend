import { useState, useCallback, useEffect, useRef } from "react";
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

const TASK_CNT = 8;

export default function UserTasks({
    user,
    style,
}: {
    user: User;
    style?: any;
}) {
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);

    const [includeCompleted, setIncludeCompleted] = useState(false);
    const [status, setStatus] = useState<Status>(Status.LOADING);
    const waitingUpdate = useRef(false);
    const allGot = useRef(false);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await user!.tasks(includeCompleted, 0, TASK_CNT);

            console.log(`${res.length} task recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
            allGot.current = false;
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [user, includeCompleted]);

    const updateTasks = useCallback(
        async (offset: number) => {
            if (allGot.current) return;
            if (waitingUpdate.current) return;
            waitingUpdate.current = true;

            try {
                const res = await user!.tasks(
                    includeCompleted,
                    offset,
                    TASK_CNT
                );

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
        },
        [user, tasks]
    );

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const percent =
                e.currentTarget.scrollTop /
                (e.currentTarget as any).scrollTopMax;
            if (percent > 0.8) updateTasks(tasks.length);
        },
        [updateTasks]
    );

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
        <Box sx={[baseStyle.box, style]}>
            <Box sx={baseStyle.headerBox}>
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
                <Typography variant="subtitle1">
                    Nessun task di annotazione ancora assegnato
                </Typography>
            ) : (
                <TasksList tasks={tasks} onScroll={handleScroll} />
            )}
        </Box>
    );
}

const TasksList = ({
    tasks,
    onScroll,
}: {
    tasks: PhysicianTask[];
    onScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}) => {
    return (
        <Box sx={baseStyle.scrollable} onScroll={onScroll}>
            <List>
                {tasks.map((task) => (
                    <Box key={task.id}>
                        <TaskItem task={task} />
                        <Divider sx={{ backgroundColor: "black" }} />
                    </Box>
                ))}
            </List>
        </Box>
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

const baseStyle = {
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
