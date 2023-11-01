import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import * as Muicon from "@mui/icons-material";

type IconName = keyof typeof Muicon;

export default function NavigationCard({
    name,
    to,
    icon,
}: {
    name: string;
    to: string;
    icon: IconName;
}) {
    const navigate = useNavigate();

    const open = useCallback(() => {
        navigate(to);
    }, [navigate, to]);

    const Icon = Muicon[icon];

    return (
        <Card style={style.card} raised>
            <CardActionArea onClick={open}>
                <CardContent style={style.cardContent}>
                    <Typography
                        variant="h6"
                        component="div"
                        align="center"
                        sx={style.title}
                    >
                        {name}
                    </Typography>
                    <Box sx={{ m: 1 }} />
                    <Icon sx={{ fontSize: 64 }} />
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

const style = {
    card: {
        backgroundColor: "white",
        borderRadius: "15px",
        width: "200px",
        margin: "auto",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
    },
};
