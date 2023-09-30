import RefreshIcon from "@mui/icons-material/Refresh";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Status from "../Model/Status";
import Box from "@mui/material/Box";

export default function LoadingError({
    status,
    errorMsg,
    onReload,
}: {
    status: Status;
    errorMsg: string;
    onReload: () => void;
}) {
    return (
        <Box>
            <Typography variant="h6">
                {status === Status.LOADING
                    ? "Caricamento in corso..."
                    : errorMsg}
            </Typography>

            <LoadingButton
                loading={status === Status.LOADING}
                loadingPosition="start"
                startIcon={<RefreshIcon />}
                variant="contained"
                color={status === Status.ERROR ? "error" : "primary"}
                onClick={onReload}
            >
                Ricarica
            </LoadingButton>
        </Box>
    );
}
