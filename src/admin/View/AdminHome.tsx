import { useContext, useEffect } from "react";
import MainContainer from "../../common/View/MainContainer";
import Grid from "@mui/material/Grid";
import NavigationCard from "../Components/NavigationCard";
import Box from "@mui/material/Box";
import { HeaderContext } from "./AdminHeader";

export default function AdminHome() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Admin");
    }, [setTitle]);

    return (
        <MainContainer>
            <Box sx={style.scrollable}>
                <Grid
                    alignItems="baseline"
                    justifyContent="center"
                    container
                    spacing={2}
                    sx={style.grid}
                >
                    <Grid container item spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <NavigationCard
                                name="Utenti"
                                to="/users"
                                icon="PersonOutlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <NavigationCard
                                name="Stats"
                                to="/mediaStats"
                                icon="Storage"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <NavigationCard
                                name="Dataset"
                                to="/datasets"
                                icon="ImageOutlined"
                            />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <NavigationCard
                                name="Task di annotazione"
                                to="/tasks"
                                icon="EventNoteOutlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <NavigationCard
                                name="Tool di annotazione"
                                to="/tools"
                                icon="CreateOutlined"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </MainContainer>
    );
}

const style = {
    grid: {
        margin: "auto",
        width: { xs: "100%", sm: "80%", md: "50%" },
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
    },
};
