import Box from "@mui/material/Box";
import AnnotationTool, {
    AnnotationToolData,
    AnnotationToolDataKey,
    EndpointsKey,
    isAnnotationToolDataValid,
    isEndpointValid,
} from "../../../common/Model/AnnotationTool";
import { useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Status from "../../../common/Model/Status";
import ButtonsFooter from "../../Components/ButtonsFooter";

const ENDPOINT_NAMES = {
    add_storage_endpoint: "Creazione import storage",
    add_webhook_endpoint: "Creazione webhook",
    create_task_endpoint: "Creazione task",
    delete_task_endpoint: "Eliminazione task",
    edit_annotation_endpoint: "Modifica annotazione",
    import_media_endpoint: "Importazione media",
    task_homepage_endpoint: "Homepage task",
    update_annotation_endpoint: "Aggiornamento annotazione",
};

export default function AnnotationToolFields({
    tool,
    onSave,
    style,
}: {
    tool?: AnnotationTool;
    onSave: (data: AnnotationToolData) => Promise<string>;
    style?: any;
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [data, setData] = useState<AnnotationToolData>(
        tool ? tool.getData() : new AnnotationToolData()
    );

    const updateData = useCallback((key: AnnotationToolDataKey, value: any) => {
        setData((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    const updateDataEndpoint = useCallback(
        (key: EndpointsKey, value: string) => {
            setData((prev) => {
                return {
                    ...prev,
                    endpoints: {
                        ...prev.endpoints,
                        [key]: value,
                    },
                };
            });
        },
        []
    );

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await onSave(data);
            setStatus(Status.IDLE);
            return res;
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore di salvataggio";
        }
    }, [onSave, data]);

    return (
        <Box sx={[baseStyle.box, style]}>
            <Box sx={baseStyle.scrollable}>
                {!tool && (
                    <Box sx={baseStyle.row}>
                        <TextField
                            required
                            variant="standard"
                            value={data.name}
                            label="Nome"
                            onChange={(e) => updateData("name", e.target.value)}
                            error={data.name === ""}
                            inputProps={{ maxLength: 255 }}
                            sx={baseStyle.field}
                        />
                    </Box>
                )}
                <Box sx={baseStyle.row}>
                    <TextField
                        required
                        variant="standard"
                        value={data.base_url}
                        label="URL base"
                        onChange={(e) => updateData("base_url", e.target.value)}
                        error={data.base_url === ""}
                        inputProps={{ maxLength: 255 }}
                        sx={baseStyle.field}
                    />
                    <TextField
                        variant="standard"
                        value={data.authorization_header}
                        label="Authentication header"
                        onChange={(e) =>
                            updateData("authorization_header", e.target.value)
                        }
                        sx={baseStyle.field}
                        inputProps={{ maxLength: 255 }}
                    />
                </Box>
                <Box sx={baseStyle.row}>
                    <TextField
                        value={data.new_instance_instructions}
                        label="Istruzioni di creazione"
                        onChange={(e) =>
                            updateData(
                                "new_instance_instructions",
                                e.target.value
                            )
                        }
                        multiline
                        rows={2}
                        sx={baseStyle.field}
                    />
                </Box>
                <Box sx={baseStyle.grid}>
                    <Typography variant="h6">Endpoint:</Typography>
                    <Grid container spacing={2}>
                        {Object.entries(data.endpoints).map(
                            ([key, value]: [string, string]) => (
                                <EndpointItem
                                    key={key}
                                    endpoint={value}
                                    endpointName={
                                        ENDPOINT_NAMES[key as EndpointsKey]
                                    }
                                    onChange={(text) =>
                                        updateDataEndpoint(
                                            key as EndpointsKey,
                                            text
                                        )
                                    }
                                />
                            )
                        )}
                    </Grid>
                </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                status={status}
                onSave={saveData}
                saveDisabled={!isAnnotationToolDataValid(data)}
            />
        </Box>
    );
}

const EndpointItem = ({
    endpoint,
    endpointName,
    onChange,
}: {
    endpoint: string;
    endpointName: string;
    onChange: (text: string) => void;
}) => {
    return (
        <Grid item xs={12} sm={6} lg={4}>
            <TextField
                variant="standard"
                value={endpoint}
                label={endpointName}
                sx={baseStyle.endpointField}
                onChange={(e) => onChange(e.target.value)}
                inputProps={{ maxLength: 255 }}
                error={!isEndpointValid(endpoint)}
            />
        </Grid>
    );
};

const baseStyle = {
    box: {
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
    field: {
        flex: 1,
        marginLeft: "16px",
        marginRight: "16px",
    },
    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        marginTop: "16px",
    },
    grid: {
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "16px",
    },
    endpointField: {
        width: "100%",
    },
};
