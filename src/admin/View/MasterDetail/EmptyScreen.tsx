import Typography from "@mui/material/Typography";
import MainContainer from "../../../common/View/MainContainer";
import AddButton from "../../Components/AddButton";
import Box from "@mui/material/Box";

export default function EmptyScreen({
    itemName,
    onAdd,
}: {
    itemName: string;
    onAdd: () => void;
}) {
    return (
        <MainContainer style={style.container}>
            <Typography variant="h5" fontWeight="bold" align="center">
                Nessun elemento trovato
            </Typography>
            <AddButton itemName={itemName} onAdd={onAdd} />
        </MainContainer>
    );
}

const style = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as "column",
    },
};
