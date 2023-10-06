import { useCallback, useContext, useEffect, useState } from "react";
import MainContainer from "../../../common/View/MainContainer";
import { HeaderContext } from "../AdminHeader";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import { useNavigate } from "react-router-dom";
import ButtonsFooter from "../../Components/ButtonsFooter";
import Status from "../../../common/Model/Status";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
    DatasetData,
    DatasetDataKey,
    MediaType,
    isDatasetValid as isDatasetDataValid,
} from "../../../common/Model/Dataset";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";

export default function AdminAddDataset() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Nuovo dataset");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [dataset, setDataset] = useState<DatasetData>(new DatasetData());

    const navigate = useNavigate();
    const { add: addDataset } = useContext(DatasetsContext);

    const exit = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);
		
        try {
            await addDataset(dataset);
            setStatus(Status.IDLE);
            setTimeout(exit, 1000);
            return "Dataset aggiunto con successo";
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore nel salvataggio";
        }
    }, [addDataset, dataset, exit]);

    const updateDataset = useCallback((key: DatasetDataKey, value: any) => {
        setDataset((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    return (
        <MainContainer style={style.container}>
            <Box sx={style.row}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={dataset.type === MediaType.IMAGE}
                            onChange={(e) =>
                                updateDataset(
                                    "type",
                                    e.target.checked
                                        ? MediaType.IMAGE
                                        : MediaType.VIDEO
                                )
                            }
                        />
                    }
                    label={
                        dataset.type === MediaType.IMAGE ? "Immagini" : "Video"
                    }
                    sx={style.field}
                />
                <TextField
                    variant="standard"
                    label="Nome"
                    placeholder="Nome del dataset"
                    value={dataset.name}
                    onChange={(e) => updateDataset("name", e.target.value)}
                    sx={[style.field, { flex: 7 }]}
                    error={dataset.name === ""}
                />
            </Box>
            <Box sx={[style.row, { justifyContent: "space-around" }]}>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="it"
                >
                    <DatePicker
                        label="Data di inizio raccolta"
                        value={dataset.start_date}
                        onChange={(date) => updateDataset("start_date", date)}
                        sx={style.field}
                        disableFuture
                    />

                    <DatePicker
                        label="Data di fine raccolta"
                        value={dataset.end_date}
                        onChange={(date) => updateDataset("end_date", date)}
                        sx={style.field}
                        disableFuture
                    />
                </LocalizationProvider>
            </Box>
            <Box sx={style.centerRow}>
                {dataset.start_date?.isAfter(dataset.end_date) && (
                    <Typography variant="subtitle1" color="error">
                        La data di inizio raccolta deve precedere quella di fine
                    </Typography>
                )}
            </Box>
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                saveDisabled={!isDatasetDataValid(dataset)}
                status={status}
                onSave={saveData}
            />
        </MainContainer>
    );
}

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
