import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import Button from "@mui/material/Button";
import ConfirmActionModal from "../../../common/View/Modal/ConfirmActionModal";
import CommunicationController from "../../../common/Model/CommunicationController";
import { useCallback, useState } from "react";

export default function UserButtons({
    user,
    onPasswordResetted,
    onEnabledToggled,
}: {
    user: User;
    onPasswordResetted: (password: string) => void;
    onEnabledToggled: (enabled: boolean) => void;
}) {
    const [showResetPWModal, setShowResetPWModal] = useState<boolean>(false);
    const [showToggleEnableModal, setShowToggleEnableModal] =
        useState<boolean>(false);

    const resetPassword = useCallback(async () => {
        const newPassword = await CommunicationController.generateNewPassword(
            user.email
        );

        onPasswordResetted(newPassword);
    }, [user.email, onPasswordResetted]);

    const toggleEnabled = useCallback(async () => {
        const enabled = await user.toggleEnabled();
        onEnabledToggled(enabled);
    }, [user, onEnabledToggled]);

    return (
        <>
            <Box sx={style.buttonsBox}>
                <Box style={{ flex: 1 }} />
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShowResetPWModal(true)}
                >
                    Reset password
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setShowToggleEnableModal(true)}
                    sx={{ marginLeft: "16px" }}
                >
                    {user.enabled ? "Disabilita" : "Abilita"} account
                </Button>
            </Box>
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
        </>
    );
}

const style = {
    buttonsBox: {
        display: "flex",
        flexDirection: "row",
    },
};
