import MainContainer from "../../common/View/MainContainer";
import * as Muicon from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export type IconName = keyof typeof Muicon;

export default function AdminHome() {
    return (
        <MainContainer>
            <Grid
                alignItems="stretch"
                justifyContent="center"
                container
                spacing={2}
                sx={style.grid}
            >
                <NavigationCard name="Utenti" to="/" icon="PersonOutlined" />
                <NavigationCard name="Dataset" to="/" icon="ImageOutlined" />
                <NavigationCard
                    name="Task di annotazione"
                    to="/"
                    icon="EventNoteOutlined"
                />
                <NavigationCard
                    name="Tool di annotazione"
                    to="/"
                    icon="CreateOutlined"
                />
            </Grid>
        </MainContainer>
    );
}

const NavigationCard = ({
    name,
    to,
    icon,
}: {
    name: string;
    to: string;
    icon: IconName;
}) => {
    const navigate = useNavigate();

    const open = useCallback(() => {
        navigate(to);
    }, [navigate, to]);

    const Icon = Muicon[icon];

    return (
        <Grid item xs="auto">
            <Card style={style.card} raised>
                <CardActionArea onClick={open}>
                    <CardContent style={{ textAlign: "center" }}>
                        <Typography
                            variant="h6"
                            component="div"
                            align="center"
                            sx={style.title}
                        >
                            {name}
                        </Typography>
                        <Box sx={{ m: 2 }} />
                        <Icon sx={{ fontSize: 64 }} />
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

const style = {
    grid: {
        margin: "auto",
        width: { xs: "100%", sm: "80%", md: "50%" },
    },
    card: {
        backgroundColor: "white",
        borderRadius: "15px",
        width: "150px",
    },
    title: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
    },
};
