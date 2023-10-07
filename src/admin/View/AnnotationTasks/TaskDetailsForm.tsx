import Task, { TaskData, isTaskDataValid } from "../../../common/Model/Task";
import TaskAssignment from "./TaskAssignment";
import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import { useCallback, useState } from "react";
import ButtonsFooter from "../../Components/ButtonsFooter";
import Status from "../../../common/Model/Status";
import Loading from "../../../common/View/Loading";

export default function TaskDetailsForm({
    task,
    users,
}: {
    task: Task;
    users: User[];
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [taskData, setTaskData] = useState<TaskData>(task.getData());

    const saveAssignment = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            setStatus(Status.IDLE);
            await task.updateAssignment(taskData.physicians);
            return "Aggiornamento completato";
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore di salvataggio";
        }
    }, [task, taskData.physicians]);

    if (users.length === 0) return <Loading />;

    return (
        <Box sx={style.box}>
            <TaskAssignment
                task={task}
                users={users}
                onAssignmentChange={(data) => {
                    setTaskData({ ...taskData, physicians: data });
                }}
            />
            <ButtonsFooter
                saveDisabled={!isTaskDataValid(taskData)}
                status={status}
                onSave={saveAssignment}
            />
        </Box>
    );
}

const style = {
    box: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
    },
};
