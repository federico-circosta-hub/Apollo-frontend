import React, { useEffect, useContext, useState, useCallback } from "react";
import AnnotationTask from "../OtherComponents/AnnotationTask";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import PhysicianTask from "../../../common/Model/PhysicianTask";
import CommunicationController from "../../../common/Model/Communication";
import UserContext from "../../../common/Model/UserContext";

export default function Annotations() {
    const [user] = useContext(UserContext);
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);
    const [status, setStatus] = useState<"loaded" | "loading" | "error">(
        "loading"
    );
    const includeCompleted = false;

    const fetchData = useCallback(async () => {
        setStatus("loading");
        const res = await CommunicationController.getPhysicianTasks(
            user.id,
            includeCompleted
        );

        console.log(`${res.length} task recevied`);
        setTasks(res);
        setStatus("loaded");
    }, [user.id, includeCompleted]);

    useEffect(() => {
        try {
            fetchData();
        } catch (err: any) {
            setStatus("error");
        }

        return () => {
            CommunicationController.abortAll();
        };
    }, [fetchData]);

    return (
        <div className="box-bianco" style={style.box}>
            {status === "loading" ? (
                <Loading />
            ) : status === "error" ? (
                <Error onRetry={fetchData} />
            ) : (
                <Box style={style.scrollable}>
                    <Grid
                        alignItems="top"
                        justifyContent="left"
                        container
                        spacing={2}
                        style={style.grid}
                    >
                        {tasks.map((task: PhysicianTask) => (
                            <GridElement task={task} />
                        ))}
                    </Grid>
                </Box>
            )}
        </div>
    );
}

const Loading = () => {
    return <CircularProgress style={{ margin: "auto" }} size={60} />;
};

const Error = ({ onRetry }: { onRetry: () => Promise<void> }) => {
    return (
        <div style={style.error}>
            <Typography
                variant="h4"
                color="red"
                fontWeight="bold"
                align="center"
            >
                ERRORE!
            </Typography>
            <Typography variant="h6" align="center">
                Errore nel carimento dei task di annotazione
            </Typography>
            <Box sx={{ m: 2 }} />
            <Button variant="contained" color="primary" onClick={onRetry}>
                Riprova
            </Button>
        </div>
    );
};

const GridElement = (props: any) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnnotationTask {...props} />
    </Grid>
);

const style = {
    box: {
        width: "95%",
        height: "88vh",
        borderRadius: "15px",
        backgroundColor: "white",
        margin: "auto",
        marginTop: "1.5vh",
        marginBottom: "1.5vh",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        padding: "5vh",
    },
    scrollable: {
        maxHeight: "100vh",
        width: "100%",
        overflow: "auto",
    },
    grid: {
        flex: 1,
        padding: "16px",
    },
    error: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as "column",
        margin: "auto",
    },
};
