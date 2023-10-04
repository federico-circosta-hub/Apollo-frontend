import { useCallback, useState } from "react";
import Status from "../../common/Model/Status";
import ConfirmActionModal from "../../common/View/Modal/ConfirmActionModal";
import ResultSnackar from "../../common/View/ResultSnackbar";
import StatusLoadingButton from "./StatusLoadingButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function ButtonsFooter({
    saveDisabled,
    status,
    onSave,
    onDelete,
    onExit,
}: {
    saveDisabled?: boolean;
    status: Status;
    onSave: () => Promise<string>;
    onDelete?: () => Promise<void>;
    onExit?: () => void;
}) {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string>("");

    const handleSave = useCallback(async () => {
        const res = await onSave();
        setSnackbarText(res);
        if (onExit) setTimeout(() => onExit(), 1000);
    }, [onSave, onExit]);

    return (
        <Box sx={style.footer}>
            {onExit && (
                <Button variant="contained" color="error" onClick={onExit}>
                    Esci
                </Button>
            )}
            {onDelete && (
                <StatusLoadingButton
                    text="Elimina"
                    status={status}
                    variant="outlined"
                    style={style.footerButton}
                    onClick={() => setShowDeleteModal(true)}
                />
            )}
            <StatusLoadingButton
                text={status === Status.ERROR ? "Riprova" : "Salva"}
                disabled={saveDisabled}
                status={status}
                style={style.footerButton}
                onClick={handleSave}
            />
            <ResultSnackar
                show={snackbarText !== ""}
                text={snackbarText}
                onClose={() => setSnackbarText("")}
                severity={status === Status.ERROR ? "error" : "success"}
            />
            <ConfirmActionModal
                text="Sei sicuro di voler eliminare questo elemento?"
                show={showDeleteModal}
                onConfirm={onDelete!}
                onClose={() => setShowDeleteModal(false)}
            />
        </Box>
    );
}

const style = {
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "8px",
        width: "100%",
    },
    footerButton: {
        marginLeft: "16px",
    },
};
