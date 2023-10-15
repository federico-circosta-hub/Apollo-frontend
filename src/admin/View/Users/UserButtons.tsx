import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import Button from "@mui/material/Button";
import ConfirmActionModal from "../../../common/View/Modal/ConfirmActionModal";
import DeanonymizedCC from "../../../common/Model/Communication/DeanonymizedCommunicationController";
import { useCallback, useState } from "react";

export default function UserButtons({
    user,
    onPasswordResetted,
}: {
    user: User;
    onPasswordResetted: (password: string) => void;
}) {
    const [showResetPWModal, setShowResetPWModal] = useState<boolean>(false);

    const resetPassword = useCallback(async () => {
        const newPassword = await DeanonymizedCC.generateNewPassword(
            user.email
        );

        onPasswordResetted(newPassword);
    }, [user.email, onPasswordResetted]);

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
            </Box>
            <ConfirmActionModal
                text="Sei sicuro di voler reimpostare la password?"
                show={showResetPWModal}
                onClose={() => setShowResetPWModal(false)}
                onConfirm={resetPassword}
            />
        </>
    );
}

const style = {
    buttonsBox: {
        display: "flex",
        flexDirection: "row",
        marginTop: "8px",
    },
};
