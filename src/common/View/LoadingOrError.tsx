import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";
import Status from "../Model/Status";
import Box from "@mui/material/Box";
import StatusLoadingButton from "../../admin/Components/StatusLoadingButton";

export default function LoadingOrError({
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

            <StatusLoadingButton
                text="Ricarica"
                onClick={onReload}
                status={status}
                icon={<RefreshIcon />}
            />
        </Box>
    );
}
