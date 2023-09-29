import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ResultSnackar({
    show,
    text,
    onClose,
    severity = "success",
    vertical = "bottom",
    horizontal = "left",
    duration = 10000,
}: {
    show: boolean;
    text: string;
    severity?: "success" | "error";
    onClose?: () => void;
    vertical?: SnackbarOrigin["vertical"];
    horizontal?: SnackbarOrigin["horizontal"];
    duration?: number;
}) {
    return (
        <Snackbar
            open={show}
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={duration}
            onClose={onClose}
            sx={{ width: "50%" }}
        >
            <Alert
                onClose={() => onClose && onClose()}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
}
