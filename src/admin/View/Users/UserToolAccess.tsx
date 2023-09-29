import Box from "@mui/material/Box";
import User, { AnnotationToolAccess } from "../../../common/Model/User";
import { useCallback, useEffect, useState } from "react";
import CommunicationController from "../../../common/Model/Communication";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";
import Status from "../../../common/Model/Status";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import CheckIcon from "@mui/icons-material/Check";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

export default function UserToolAccess({ user }: { user: User }) {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [tools, setTools] = useState<AnnotationToolAccess[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);
        try {
            const res = await user.annotationTools();
            setTools(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [user]);

    useEffect(() => {
        fetchData();

        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE) {
        return (
            <Box>
                <Typography variant="h6">
                    {status === Status.LOADING
                        ? "Caricamento in corso..."
                        : "Errore nel caricamento dei tool di annotazione"}
                </Typography>

                <LoadingButton
                    loading={status === Status.LOADING}
                    loadingPosition="start"
                    startIcon={<RefreshIcon />}
                    variant="contained"
                    color="error"
                    onClick={fetchData}
                >
                    Ricarica
                </LoadingButton>
            </Box>
        );
    }

    return (
        <Box sx={style.box}>
            <Typography sx={{ flex: 1 }} variant="h5">
                Grant access to:
            </Typography>
            {tools.length === 0 ? (
                <Typography variant="h6">
                    Nessun task di annotazione assegnato
                </Typography>
            ) : (
                <AnnotationToolsForm tools={tools} user={user} />
            )}
        </Box>
    );
}

const AnnotationToolsForm = ({
    user,
    tools,
}: {
    user: User;
    tools: AnnotationToolAccess[];
}) => {
    const [instructions, setInstructions] = useState<string>("");

    const showInstructions = useCallback(
        (access: boolean, instructions: string) => {
            setInstructions(
                access
                    ? `Diritti di accesso dati. Segui le istruzioni per completare l'operazione: ${instructions}`
                    : "Diritti di accesso revocati"
            );
        },
        []
    );

    const showError = useCallback(() => {
        setInstructions("Errore nel salvataggio");
    }, []);

    return (
        <>
            <Box sx={style.scrollable}>
                <FormGroup>
                    {tools.map((tool) => (
                        <Box key={tool.id}>
                            <ToolAccess
                                tool={tool}
                                user={user}
                                onSave={showInstructions}
                                onError={showError}
                            />
                            <Divider sx={style.checkboxDivider} />
                        </Box>
                    ))}
                </FormGroup>
            </Box>
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
                {instructions}
            </Typography>
        </>
    );
};

const ToolAccess = ({
    user,
    tool,
    onSave,
    onError,
}: {
    user: User;
    tool: AnnotationToolAccess;
    onSave: (access: boolean, instructions: string) => void;
    onError: () => void;
}) => {
    const [endpoint, setEndpoint] = useState<string>(tool.endpoint);
    const [access, setAccess] = useState<boolean>(tool.access);
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const handleAccessChange = useCallback(async () => {
        let instructions = "";
        setStatus(Status.LOADING);

        try {
            instructions = await user.toggleAnnotationToolAccess(
                tool.id,
                access,
                endpoint
            );
            tool.access = access;
            tool.endpoint = endpoint;

            setStatus(Status.IDLE);
            onSave(access, instructions);
        } catch (err: any) {
            setStatus(Status.ERROR);
            setAccess(tool.access);
            setEndpoint(tool.endpoint);
            onError();
        }
    }, [user, tool, access, endpoint, onSave, onError]);

    return (
        <Box sx={style.checkbox}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={access}
                        onChange={(_event, checked) => setAccess(checked)}
                    />
                }
                sx={{ flex: 1 }}
                label={tool.name}
            />
            <Box sx={{ flex: 1 }} />
            <TextField
                value={endpoint}
                placeholder="Endpoint"
                onChange={(e) => setEndpoint(e.target.value)}
                variant="standard"
                inputProps={{ maxLength: 255 }}
            />
            <Box sx={{ flex: 1 }} />
            <LoadingButton
                disabled={
                    access === tool.access &&
                    (!access || endpoint === tool.endpoint)
                }
                loading={status === Status.LOADING}
                loadingPosition="start"
                startIcon={<CheckIcon />}
                variant="contained"
                onClick={handleAccessChange}
            >
                Salva
            </LoadingButton>
        </Box>
    );
};

const style = {
    box: {
        display: "flex",
        flexDirection: "column" as "column",
        maxHeight: "50%",
    },
    checkbox: {
        display: "flex",
        flexDirection: "row" as "row",
    },
    checkboxDivider: {
        backgroundColor: "black",
        marginTop: "8px",
        marginBottom: "8px",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        margin: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
};
