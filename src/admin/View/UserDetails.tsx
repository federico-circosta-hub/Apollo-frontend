import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import User from "../../common/Model/User";
import { DetailItemProps } from "./MasterDetail/MasterDetail";
import ConfirmActionModal from "../../common/View/Modal/ConfirmActionModal";
import { useCallback, useState } from "react";
import CommunicationController from "../../common/Model/Communication";
import ResultSnackar from "../../common/View/ResultSnackbar";

export default function UserDetails({ item }: DetailItemProps) {
    const user = item as User;

    const [snackbarText, setSnackbarText] = useState<string>("");
    const [showResetPWModal, setShowResetPWModal] = useState<boolean>(false);
    const [showToggleEnableModal, setShowToggleEnableModal] =
        useState<boolean>(false);

    const resetPassword = useCallback(async () => {
        const newPassword = await CommunicationController.generateNewPassword(
            user.email
        );
        navigator.clipboard.writeText(newPassword);
        setSnackbarText(`La nuova password è stata copiata negli appunti!`);
    }, [user.email]);

    const toggleEnabled = useCallback(async () => {
        const enabled = await CommunicationController.toggleEnable(user.id);
        user.enabled = enabled;
        setSnackbarText(`Utente ${enabled ? "abilitato" : "disabilitato"}!`);
    }, [user]);

    return (
        <Box sx={style.box}>
            <Box sx={{ flex: 1 }} />
            <Buttons
                user={user}
                onResetPassword={() => setShowResetPWModal(true)}
                onDisableAccount={() => setShowToggleEnableModal(true)}
            />
            <ConfirmActionModal
                text="Sei sicuro di voler reimpostare la password?"
                show={showResetPWModal}
                onClose={() => setShowResetPWModal(false)}
                onConfirm={resetPassword}
            />
            <ConfirmActionModal
                text="Sei sicuro di voler abilitare/disabilitare l'account?"
                show={showToggleEnableModal}
                onClose={() => setShowToggleEnableModal(false)}
                onConfirm={toggleEnabled}
            />
            <ResultSnackar
                text={snackbarText}
                onClose={() => setSnackbarText("")}
            />
        </Box>
    );
}

const Buttons = ({
    user,
    onResetPassword,
    onDisableAccount,
}: {
    user: User;
    onResetPassword: () => void;
    onDisableAccount: () => void;
}) => {
    return (
        <Box sx={style.buttonsBox}>
            <Box style={{ flex: 1 }} />
            <Button variant="outlined" color="error" onClick={onResetPassword}>
                Reset password
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={onDisableAccount}
                sx={{ marginLeft: "16px" }}
            >
                {user.enabled ? "Disabilita" : "Abilita"} account
            </Button>
        </Box>
    );
};

const style = {
    box: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
    },
    buttonsBox: {
        display: "flex",
        flexDirection: "row",
    },
};
