import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ResultSnackar({
    text,
    onClose,
    severity = "success",
}: {
    text: string;
    severity?: "success" | "error";
    onClose: () => void;
}) {
    return (
        <Snackbar
            open={text !== ""}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={10000}
            onClose={onClose}
            sx={{ width: "50%" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {text}
            </Alert>
        </Snackbar>
    );
}
