import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MainContainer from "../../../common/View/MainContainer";

export default function ErrorScreen({
    onRetry,
}: {
    onRetry: () => Promise<void>;
}) {
    return (
        <MainContainer style={style.container}>
            <Typography
                variant="h4"
                color="red"
                fontWeight="bold"
                align="center"
            >
                ERRORE!
            </Typography>
            <Typography variant="h6" align="center">
                Errore di carimento
            </Typography>
            <Box sx={{ m: 2 }} />
            <Button variant="contained" color="primary" onClick={onRetry}>
                Riprova
            </Button>
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
