import Box from "@mui/material/Box";
import User, { AnnotationToolAccess } from "../../../common/Model/User";
import { useCallback, useEffect, useState } from "react";
import CommunicationController from "../../../common/Model/Communication";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";
import Status from "../../../common/Model/Status";
import LoadingButton from "@mui/lab/LoadingButton";

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

    if (tools.length === 0) return <></>;

    return (
        <Box sx={style.box}>
            <Typography variant="h5">Grant access to:</Typography>
            {tools.map((tool) => (
                <ToolAccess key={tool.id} tool={tool} />
            ))}
        </Box>
    );
}

const ToolAccess = ({ tool }: { tool: AnnotationToolAccess }) => {
    return <>{tool.name}</>;
};

const style = {
    box: {
        display: "flex",
        flexDirection: "column" as "column",
    },
};
