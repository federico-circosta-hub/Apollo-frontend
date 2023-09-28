import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import User from "../../common/Model/User";
import { DetailItemProps } from "./MasterDetail/MasterDetail";

export default function UserDetails({ item }: DetailItemProps) {
    const user = item as User;

    console.log("qui");
    return (
        <Box sx={style.box}>
            <Box sx={{ flex: 1 }} />
            <Buttons onResetPassword={() => {}} onDisableAccount={() => {}} />
        </Box>
    );
}

const Buttons = ({
    onResetPassword,
    onDisableAccount,
}: {
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
                Disabilita account
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
