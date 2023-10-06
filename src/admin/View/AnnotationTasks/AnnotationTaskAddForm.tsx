import Box from "@mui/material/Box";
import ButtonsFooter from "../../Components/ButtonsFooter";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";
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

export default function AnnotationTaskAddForm({
    datasets,
    tools,
}: {
    datasets: Dataset[];
    tools: AnnotationTool[];
}) {
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
        console.log(key, value);
        setTask((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    return (
        <MainContainer style={style.container}>
            <Box sx={style.row}>
                <DatasetSelect
                    value={task.dataset}
                    datasets={datasets}
                    onSelect={(value) => updateTask("dataset", value)}
                />
            </Box>
            <Box sx={style.row}>
                <TypeSelect
                    value={task.annotation_type}
                    tools={tools}
                    onSelect={(value) => updateTask("annotation_type", value)}
                />
            </Box>
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
                        {d.name}
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
    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        marginTop: "16px",
    },
    centerRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        marginTop: "4px",
    },
    field: {
        flex: 1,
        marginLeft: "16px",
        marginRight: "16px",
    },
};
