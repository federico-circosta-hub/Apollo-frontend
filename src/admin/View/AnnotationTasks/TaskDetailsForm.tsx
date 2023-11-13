import Task, { TaskData } from "../../../common/Model/Task";
import TaskAssignment from "./TaskAssignment";
import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import { useCallback, useState } from "react";
import Status from "../../../common/Model/Status";
import LoadingSpinner from "../../../common/View/LoadingSpinner";
import TaskStatus from "./TaskStatus";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import StatusLoadingButton from "../../Components/StatusLoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import TaskConflictsMatrixTable from "./TaskConflictMatrix";

export default function TaskDetailsForm({
    task,
    users,
}: {
    task: Task;
    users: User[];
}) {
    const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

    if (users.length === 0) return <LoadingSpinner />;

    return (
        <Box sx={style.box}>
            <TaskStatus
                task={task}
                users={users}
                style={{ maxHeight: "40%" }}
            />

            <Box sx={style.footer}>
                <Button
                    variant="contained"
                    onClick={() => setShowAssignModal(true)}
                    sx={style.footerButton}
                >
                    Assegna
                </Button>
                <AssignModal
                    show={showAssignModal}
                    task={task}
                    users={users}
                    onClose={() => setShowAssignModal(false)}
                />
            </Box>

            <Box sx={{ m: 1 }} />
            <TaskConflictsMatrixTable
                task={task}
                users={users}
                style={{ maxHeight: "40%" }}
            />
        </Box>
    );
}

const AssignModal = ({
    show,
    task,
    users,
    onClose,
}: {
    show: boolean;
    task: Task;
    users: User[];
    onClose: () => void;
}) => {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [taskData, setTaskData] = useState<TaskData>(task.getData());

    const saveAssignment = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            await task.updateAssignment(taskData.physicians);
            setStatus(Status.IDLE);
            onClose();
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [task, taskData.physicians, onClose]);

    return (
        <Dialog
            open={show}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={style.assignDialog}
        >
            <DialogTitle id="alert-dialog-title">Assegna a:</DialogTitle>

            <DialogContent>
                <TaskAssignment
                    task={task}
                    users={users}
                    onAssignmentChange={(data) => {
                        setTaskData({ ...taskData, physicians: data });
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Annulla
                </Button>
                <StatusLoadingButton
                    text={status === Status.IDLE ? "Salva" : "Riprova"}
                    status={status}
                    onClick={saveAssignment}
                />
            </DialogActions>
        </Dialog>
    );
};

const style = {
    box: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "auto",
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "8px",
        width: "100%",
    },
    footerButton: {
        textTransform: "none",
    },
    assignDialog: {
        "& .MuiDialog-container": {
            "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "75%",
            },
        },
    },
};
