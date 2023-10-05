import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useCallback, useState } from "react";
import Status from "../../Model/Status";
import StatusLoadingButton from "../../../admin/Components/StatusLoadingButton";

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
                <Button onClick={onClose} variant="outlined">
                    Annulla
                </Button>
                <StatusLoadingButton
                    text={status === Status.IDLE ? "Conferma" : "Riprova"}
                    status={status}
                    onClick={handleConfirm}
                />
            </DialogActions>
        </Dialog>
    );
}
