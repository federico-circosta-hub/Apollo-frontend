import { useCallback, useContext, useEffect } from "react";
import MainContainer from "../../../common/View/MainContainer";
import { HeaderContext } from "../AdminHeader";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";
import { UserData } from "../../../common/Model/User";
import UserFields from "./UserFields";
import { useNavigate } from "react-router-dom";

export default function AdminAddUser() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Nuovo utente");
    }, [setTitle]);

    const { add: addUser } = useContext(PhysiciansContext);

	const navigate = useNavigate();
    const exit = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const saveData = useCallback(
        async (data: UserData) => {
            const newUser = await addUser(data);
            navigator.clipboard.writeText(newUser!.password!);
			
			setTimeout(exit, 1000)

            return "Utente aggiunto con successo; password copiata negli appunti";
        },
        [addUser, exit]
    );

    return (
        <MainContainer style={style.container}>
            <UserFields onSave={saveData} />
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
    field: {
        flex: 1,
        marginLeft: "16px",
        marginRight: "16px",
    },
};
