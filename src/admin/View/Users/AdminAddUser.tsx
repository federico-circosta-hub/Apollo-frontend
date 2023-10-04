import { useCallback, useContext, useEffect, useState } from "react";
import MainContainer from "../../../common/View/MainContainer";
import { HeaderContext } from "../AdminHeader";
import { useNavigate } from "react-router-dom";
import ButtonsFooter from "../../Components/ButtonsFooter";
import Status from "../../../common/Model/Status";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";
import {
    UserData,
    UserDataKey,
    isUserEmailValid,
    isUserValid,
} from "../../../common/Model/User";

export default function AdminAddUser() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Nuovo utente");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const [user, setUser] = useState<UserData>(new UserData());

    const navigate = useNavigate();
    const { add: addUser } = useContext(PhysiciansContext);

    const exit = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const saveData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const newUser = await addUser(user);
            navigator.clipboard.writeText(newUser!.password!);
            setStatus(Status.IDLE);
            return "Utente aggiunto con successo; password copiata negli appunti";
        } catch (err: any) {
            setStatus(Status.ERROR);
            return "Errore nel salvataggio";
        }
    }, [addUser, user]);

    const updateUser = useCallback((key: UserDataKey, value: any) => {
        setUser((prev) => {
            return {
                ...prev,
                [key]: value,
            };
        });
    }, []);

    return (
        <MainContainer style={style.container}>
            <Box sx={style.row}>
                <TextField
                    variant="standard"
                    label="Email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => updateUser("email", e.target.value)}
                    sx={style.field}
                    error={!isUserEmailValid(user.email)}
                />
            </Box>
            <Box sx={style.row}>
                <TextField
                    variant="standard"
                    label="Nome"
                    placeholder="Nome"
                    value={user.name}
                    onChange={(e) => updateUser("name", e.target.value)}
                    sx={style.field}
                    error={user.name === ""}
                />

                <TextField
                    variant="standard"
                    label="Cognome"
                    placeholder="Cognome"
                    value={user.surname}
                    onChange={(e) => updateUser("surname", e.target.value)}
                    sx={style.field}
                    error={user.surname === ""}
                />
            </Box>
            <Box sx={{ flex: 1 }} />
            <ButtonsFooter
                saveDisabled={!isUserValid(user)}
                status={status}
                onSave={saveData}
                onExit={exit}
            />
        </MainContainer>
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
    centerRow: {
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        marginTop: "4px",
    },
    field: {
        flex: 1,
        marginLeft: "16px",
        marginRight: "16px",
    },
};
