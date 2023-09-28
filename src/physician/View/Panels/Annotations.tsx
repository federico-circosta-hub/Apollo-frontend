import React, { useEffect, useContext, useState, useCallback } from "react";
import AnnotationTask from "../OtherComponents/AnnotationTask";
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
} from "@mui/material";
import PhysicianTask from "../../../common/Model/PhysicianTask";
import CommunicationController from "../../../common/Model/Communication";
import UserContext from "../../../common/Model/UserContext";
import MainContainer from "../../../common/View/MainContainer";
import Loading from "../../../common/View/Loading";

export default function Annotations() {
    const [user] = useContext(UserContext);
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);

    const [status, setStatus] = useState<"loaded" | "loading" | "error">(
        "loading"
    );

    const [includeCompleted, setIncludeCompleted] = useState<boolean>(false);
    const toggleInclude = () => setIncludeCompleted(!includeCompleted);

    const fetchData = useCallback(async () => {
        setStatus("loading");

        try {
            const res = await CommunicationController.getPhysicianTasks(
                user!.id,
                includeCompleted
            );

            console.log(`${res.length} task recevied`);
            setTasks(res);
            setStatus("loaded");
        } catch (err: any) {
            setStatus("error");
        }
    }, [user, includeCompleted]);

    useEffect(() => {
        fetchData();

        return () => CommunicationController.abortLast();
    }, [fetchData]);

    return (
        <MainContainer>
            {status === "loading" ? (
                <Loading />
            ) : status === "error" ? (
                <Error onRetry={fetchData} />
            ) : (
                <AnnotationGrid
                    tasks={tasks}
                    includeCompleted={includeCompleted}
                    onToogleInclude={toggleInclude}
                />
            )}
        </MainContainer>
    );
}

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

const AnnotationGrid = ({
    tasks,
    includeCompleted,
    onToogleInclude,
}: {
    tasks: PhysicianTask[];
    includeCompleted: boolean;
    onToogleInclude: () => void;
}) => {
    return (
        <>
            <FormControlLabel
                style={{ margin: "auto" }}
                control={
                    <Switch
                        checked={includeCompleted}
                        onChange={onToogleInclude}
                    />
                }
                label="Includi task completati"
            />
            <Box style={style.scrollable}>
                <Grid
                    alignItems="top"
                    justifyContent="left"
                    container
                    spacing={2}
                    style={style.grid}
                >
                    {tasks.map((task: PhysicianTask) => (
                        <GridElement key={task.id} task={task} />
                    ))}
                </Grid>
            </Box>
        </>
    );
};

const GridElement = (props: any) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnnotationTask {...props} />
    </Grid>
);

const style = {
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        flex: 1,
    },
    grid: {
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
