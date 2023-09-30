import Box from "@mui/material/Box";
import AnnotationTool, {
    AnnotationToolEndpoints,
} from "../../../common/Model/AnnotationTool";
import { useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Status from "../../../common/Model/Status";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SaveIcon from "@mui/icons-material/Save";
import ResultSnackar from "../../../common/View/ResultSnackbar";

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

type ENamesKeys = keyof typeof ENDPOINT_NAMES;

export default function AnnotationToolForm({
    tool,
    style,
}: {
    tool: AnnotationTool;
    style?: any;
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [snackbarText, setSnackbarText] = useState<string>("");

    const [baseURL, setBaseURL] = useState<string>(tool.base_url);
    const [authHeader, setAuthHeader] = useState<string>(
        tool.authorization_header
    );
    const [instructions, setInstructions] = useState<string>(
        tool.new_instance_instructions
    );

    const [endpoints, setEndpoints] = useState<AnnotationToolEndpoints>({
        add_storage_endpoint: tool.add_storage_endpoint,
        add_webhook_endpoint: tool.add_webhook_endpoint,
        create_task_endpoint: tool.create_task_endpoint,
        delete_task_endpoint: tool.delete_task_endpoint,
        edit_annotation_endpoint: tool.edit_annotation_endpoint,
        import_media_endpoint: tool.import_media_endpoint,
        task_homepage_endpoint: tool.task_homepage_endpoint,
        update_annotation_endpoint: tool.update_annotation_endpoint,
    });

    const handleEndpointChange = useCallback(
        (name: string, value: string) => {
            setEndpoints({ ...endpoints, [name]: value });
        },
        [endpoints]
    );

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const updated = await tool.update({
                base_url: baseURL,
                authorization_header: authHeader,
                new_instance_instructions: instructions,
                endpoints,
            });
            setStatus(Status.IDLE);

            setSnackbarText(
                updated
                    ? "Modifiche salvate con successo"
                    : "Nessuna modifica da salvare"
            );
        } catch (err: any) {
            setStatus(Status.ERROR);
            setSnackbarText("Errore di salvataggio");
        }
    }, [tool, baseURL, authHeader, instructions, endpoints]);

    return (
        <Box sx={[baseStyle.box, style]}>
            <Box sx={baseStyle.scrollable}>
                <TextField
                    required
                    variant="standard"
                    value={baseURL}
                    label="URL base"
                    onChange={(e) => setBaseURL(e.target.value)}
                    error={baseURL === ""}
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    variant="standard"
                    value={authHeader}
                    label="Authentication header"
                    onChange={(e) => setAuthHeader(e.target.value)}
                    sx={baseStyle.marginMedium}
                    inputProps={{ maxLength: 255 }}
                />
                <TextField
                    value={instructions}
                    label="Istruzioni di creazione"
                    onChange={(e) => setInstructions(e.target.value)}
                    multiline
                    rows={2}
                    sx={baseStyle.marginBig}
                />
                <Typography variant="h6" sx={baseStyle.marginSmall}>
                    Endpoint:
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(endpoints).map(
                        ([key, value]: [string, string]) => (
                            <EndpointItem
                                endpoint={value}
                                endpointName={ENDPOINT_NAMES[key as ENamesKeys]}
                                onChange={(text) =>
                                    handleEndpointChange(
                                        ENDPOINT_NAMES[key as ENamesKeys],
                                        text
                                    )
                                }
                            />
                        )
                    )}
                </Grid>
            </Box>
            <Box sx={baseStyle.footer}>
                <LoadingButton
                    disabled={baseURL === ""}
                    loading={status === Status.LOADING}
                    loadingPosition="start"
                    startIcon={
                        status === Status.ERROR ? (
                            <ErrorOutlineIcon />
                        ) : (
                            <SaveIcon />
                        )
                    }
                    variant="contained"
                    color={status === Status.ERROR ? "error" : "primary"}
                    onClick={saveData}
                >
                    {status === Status.ERROR ? "Riprova" : "Salva"}
                </LoadingButton>
                <ResultSnackar
                    show={snackbarText !== ""}
                    text={snackbarText}
                    onClose={() => setSnackbarText("")}
                    severity={status === Status.ERROR ? "error" : "success"}
                    horizontal="right"
                />
            </Box>
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
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "8px",
    },
    marginSmall: {
        marginTop: "8px",
    },
    marginMedium: {
        marginTop: "16px",
    },
    marginBig: {
        marginTop: "24px",
    },
    endpointField: {
        width: "100%",
    },
};
