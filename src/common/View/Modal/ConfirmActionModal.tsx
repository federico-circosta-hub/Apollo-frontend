import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useCallback, useState } from "react";
import Status from "../../Model/Status";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";

export default function ConfirmActionModal({
    text,
    show,
    onConfirm,
    onClose,
}: {
    text: string;
    show: boolean;
    onConfirm: () => Promise<any>;
    onClose: () => void;
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const handleConfirm = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            await onConfirm();
            setStatus(Status.IDLE);
            onClose();
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [onConfirm, onClose]);

    return (
        <Dialog
            open={show}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{text}</DialogTitle>
            {status === Status.ERROR && (
                <DialogContent>
                    <DialogContentText>
                        Errore durante l'esecuzione dell'operazione. Riprovare?
                    </DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onClose}>Annulla</Button>
                <LoadingButton
                    onClick={handleConfirm}
                    loading={status === Status.LOADING}
                    startIcon={
                        status === Status.ERROR ? (
                            <ErrorOutlineIcon />
                        ) : (
                            <CheckIcon />
                        )
                    }
                    loadingPosition="start"
                    color={status === Status.ERROR ? "error" : "primary"}
                >
                    {status === Status.IDLE ? "Conferma" : "Riprova"}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
