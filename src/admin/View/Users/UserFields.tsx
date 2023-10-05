import { useCallback, useState } from "react";
import User, {
    UserData,
    UserDataKey,
    isUserEmailValid,
    isUserValid,
} from "../../../common/Model/User";
import Status from "../../../common/Model/Status";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ButtonsFooter from "../../Components/ButtonsFooter";

export default function UserFields({
    user,
    onSave,
}: {
    user?: User;
    onSave: (data: UserData) => Promise<string>;
}) {
    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [data, setData] = useState<UserData>(
        user ? user.getData() : new UserData()
    );

    const updateUser = useCallback((key: UserDataKey, value: any) => {
        setData((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await onSave(data);
            setStatus(Status.IDLE);
            return res;
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore nel salvataggio";
        }
    }, [onSave, data]);

    return (
        <>
            <Box sx={style.row}>
                <TextField
                    variant="standard"
                    label="Email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => updateUser("email", e.target.value)}
                    sx={style.field}
                    error={!isUserEmailValid(data.email)}
                />
            </Box>
            <Box sx={style.row}>
                <TextField
                    variant="standard"
                    label="Nome"
                    placeholder="Nome"
                    value={data.name}
                    onChange={(e) => updateUser("name", e.target.value)}
                    sx={style.field}
                    error={data.name === ""}
                />

                <TextField
                    variant="standard"
                    label="Cognome"
                    placeholder="Cognome"
                    value={data.surname}
                    onChange={(e) => updateUser("surname", e.target.value)}
                    sx={style.field}
                    error={data.surname === ""}
                />
            </Box>
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                saveDisabled={!isUserValid(data)}
                status={status}
                onSave={saveData}
            />
        </>
    );
}

const style = {
    container: {
        alignItems: "flex-start",
    },
    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        marginTop: "16px",
    },
    field: {
        flex: 1,
        marginLeft: "16px",
        marginRight: "16px",
    },
};
