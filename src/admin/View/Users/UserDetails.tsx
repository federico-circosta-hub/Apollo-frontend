import Box from "@mui/material/Box";
import User from "../../../common/Model/User";
import { DetailItemProps } from "../MasterDetail/MasterDetail";
import { useCallback, useState } from "react";
import ResultSnackar from "../../../common/View/ResultSnackbar";
import UserButtons from "./UserButtons";
import UserToolAccess from "./UserToolAccess";

export default function UserDetails({ item }: DetailItemProps) {
    const user = item as User;
    const [snackbarText, setSnackbarText] = useState<string>("");

    const onPasswordResetted = useCallback((password: string) => {
        navigator.clipboard.writeText(password);
        setSnackbarText(`La nuova password è stata copiata negli appunti!`);
    }, []);

    const onEnabledToggled = useCallback((enabled: boolean) => {
        setSnackbarText(`Utente ${enabled ? "abilitato" : "disabilitato"}!`);
    }, []);

    return (
        <Box sx={style.box}>
            <UserToolAccess user={user} />
            <Box sx={{ flex: 1 }} />
            <UserButtons
                user={user}
                onPasswordResetted={onPasswordResetted}
                onEnabledToggled={onEnabledToggled}
            />
            <ResultSnackar
                text={snackbarText}
                onClose={() => setSnackbarText("")}
            />
        </Box>
    );
}

const style = {
    box: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
    },
};
