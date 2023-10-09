import Box from "@mui/material/Box";
import ButtonsFooter from "../../Components/ButtonsFooter";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MainContainer from "../../../common/View/MainContainer";
import Dataset from "../../../common/Model/Dataset";
import AddIcon from "@mui/icons-material/Add";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ReactNode, useCallback, useContext, useState } from "react";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import {
    TaskData,
    TaskDataKey,
    isTaskDataValid,
} from "../../../common/Model/Task";
import Status from "../../../common/Model/Status";
import { AnnotationTasksContext } from "../../ViewModel/AnnotationTasksProvider";
import User from "../../../common/Model/User";
import TaskAssignment from "./TaskAssignment";
import { ListItemText } from "@mui/material";

export default function AnnotationTaskAddForm({
    datasets,
    tools,
    users,
}: {
    datasets: Dataset[];
    tools: AnnotationTool[];
    users: User[];
}) {
    const hasUserAccessToType = useCallback(
        (user: User, type: number): boolean => {
            if (type < 0) return true;
            const tool = tools.find(
                (t) =>
                    t.annotationTypes.find((at) => at.id === type) !== undefined
            );
            if (!tool) return false;
            return (
                user.toolsAccess.find((t) => t.id === tool.id && t.access) !==
                undefined
            );
        },
        [tools]
    );

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const { add: addTask } = useContext(AnnotationTasksContext);
    const [task, setTask] = useState<TaskData>(new TaskData());

    const navigate = useNavigate();
    const exit = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            await addTask(task);
            setStatus(Status.IDLE);
            setTimeout(exit, 1000);
            return "Task di annotazione aggiunto con successo";
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore nel salvataggio";
        }
    }, [addTask, task, exit]);

    const updateTask = useCallback((key: TaskDataKey, value: any) => {
        setTask((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    return (
        <MainContainer style={style.container}>
            <DatasetSelect
                value={task.dataset}
                datasets={datasets}
                onSelect={(value) => updateTask("dataset", value)}
            />
            <TypeSelect
                value={task.annotation_type}
                tools={tools}
                onSelect={(value) => updateTask("annotation_type", value)}
            />
            <Typography variant="h5" sx={{ marginTop: "8px" }}>
                Assegna a:
            </Typography>
            <TaskAssignment
                users={users.filter((u) =>
                    hasUserAccessToType(u, task.annotation_type)
                )}
                style={style.field}
                onAssignmentChange={(value) => updateTask("physicians", value)}
            />
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                saveDisabled={!isTaskDataValid(task)}
                status={status}
                onSave={saveData}
            />
        </MainContainer>
    );
}

const DatasetSelect = ({
    value,
    datasets,
    onSelect,
}: {
    value: number;
    datasets: Dataset[];
    onSelect: (value: number) => void;
}) => {
    const navigate = useNavigate();

    const addDataset = useCallback(() => {
        navigate("/datasets/add");
    }, [navigate]);

    return (
        <FormControl sx={style.field}>
            <InputLabel htmlFor="select-dataset">Dataset</InputLabel>
            <Select
                id="select-dataset"
                value={value}
                label="Dataset"
                onChange={(e) => onSelect(Number(e.target.value))}
            >
                <ListSubheader sx={{ display: "flex" }}>
                    <Typography variant="subtitle1">
                        Seleziona un dataset
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Button startIcon={<AddIcon />} onClick={addDataset}>
                        Nuovo dataset
                    </Button>
                    <Divider sx={{ backgroundColor: "black" }} />
                </ListSubheader>

                {datasets.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                        <ListItemText
                            primary={d.name}
                            secondary={
                                d.media_count +
                                (d.type ? " immagini" : " video")
                            }
                        />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const TypeSelect = ({
    value,
    tools,
    onSelect,
}: {
    value: number;
    tools: AnnotationTool[];
    onSelect: (value: number) => void;
}) => {
    const navigate = useNavigate();

    const items: ReactNode[] = [];
    let cnt = 0;
    for (const tool of tools) {
        items.push(getTypeHeader(tool, navigate, cnt));
        cnt++;
        const typeItems = getTypeItems(tool, cnt);
        cnt += typeItems.length;
        items.push(...typeItems);
    }

    return (
        <FormControl sx={style.field}>
            <InputLabel htmlFor="select-type">Tipo di annotazione</InputLabel>
            <Select
                id="select-type"
                value={value}
                label="Tipo di annotazione"
                onChange={(e) => onSelect(Number(e.target.value))}
            >
                {items}
            </Select>
        </FormControl>
    );
};

const getTypeHeader = (
    tool: AnnotationTool,
    navigate: NavigateFunction,
    index: number
) => {
    const addType = (tool: AnnotationTool) => {
        navigate("/tools?id=" + tool.id);
    };

    return (
        <ListSubheader sx={{ display: "flex" }} key={index}>
            <Typography variant="subtitle1">{tool.name}</Typography>
            <Box sx={{ flex: 1 }} />
            <Button startIcon={<AddIcon />} onClick={() => addType(tool)}>
                Nuovo tipo
            </Button>
            <Divider sx={{ backgroundColor: "black" }} />
        </ListSubheader>
    );
};

const getTypeItems = (tool: AnnotationTool, offset: number) => {
    return tool.annotationTypes.map((type, index) => (
        <MenuItem key={offset + index} value={type.id}>
            {type.name}
        </MenuItem>
    ));
};

const style = {
    container: {
        alignItems: "flex-start",
    },
    field: {
        width: "fill-available",
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "16px",
    },
};
