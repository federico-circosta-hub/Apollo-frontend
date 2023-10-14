import React, {
    useEffect,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
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
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import UserContext from "../../../common/Model/UserContext";
import MainContainer from "../../../common/View/MainContainer";
import Loading from "../../../common/View/Loading";
import Status from "../../../common/Model/Status";

const TASK_CNT = 16;

export default function Annotations() {
    const [user] = useContext(UserContext);
    const [tasks, setTasks] = useState<PhysicianTask[]>([]);

    const [status, setStatus] = useState<Status>(Status.LOADING);
    const waitingUpdate = useRef(false);
    const allGot = useRef(false);

    const [includeCompleted, setIncludeCompleted] = useState<boolean>(false);
    const toggleInclude = () => setIncludeCompleted(!includeCompleted);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await user!.tasks(includeCompleted, 0, TASK_CNT);

            console.log(`${res.length} task recevied`);
            setTasks(res);
            setStatus(Status.IDLE);
            allGot.current = false;
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [user, includeCompleted]);

    const updateTasks = useCallback(
        async (offset: number) => {
            if (allGot.current) return;
            if (waitingUpdate.current) return;
            waitingUpdate.current = true;

            try {
                const res = await user!.tasks(
                    includeCompleted,
                    offset,
                    TASK_CNT
                );

                const newTasks = res.filter(
                    (task) => tasks.find((t) => t.id === task.id) === undefined
                );

                waitingUpdate.current = false;
                if (newTasks.length === 0) {
                    allGot.current = true;
                    return;
                }

                setTasks((prev) => [...prev, ...newTasks]);
            } catch (err: any) {
                waitingUpdate.current = false;
                setStatus(Status.ERROR);
            }
        },
        [user, tasks]
    );

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const percent =
                e.currentTarget.scrollTop /
                (e.currentTarget as any).scrollTopMax;
            if (percent > 0.8) updateTasks(tasks.length);
        },
        [updateTasks]
    );

    useEffect(() => {
        fetchData();

        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status === Status.LOADING)
        return (
            <MainContainer>
                <Loading />
            </MainContainer>
        );
    if (status === Status.ERROR) return <Error onRetry={fetchData} />;

    return (
        <MainContainer>
            <AnnotationGrid
                tasks={tasks}
                includeCompleted={includeCompleted}
                onToogleInclude={toggleInclude}
                onScroll={handleScroll}
            />
        </MainContainer>
    );
}

const Error = ({ onRetry }: { onRetry: () => Promise<void> }) => {
    return (
        <MainContainer style={style.error}>
            <Typography
                variant="h4"
                color="red"
                fontWeight="bold"
                align="center"
            >
                ERRORE!
            </Typography>
            <Typography variant="h6" align="center">
                Nessun task di annotazione
            </Typography>
            <Box sx={{ m: 2 }} />
            <Button variant="contained" color="primary" onClick={onRetry}>
                Riprova
            </Button>
        </MainContainer>
    );
};

const AnnotationGrid = ({
    tasks,
    includeCompleted,
    onToogleInclude,
    onScroll,
}: {
    tasks: PhysicianTask[];
    includeCompleted: boolean;
    onToogleInclude: () => void;
    onScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}) => {
    const box = useRef<HTMLInputElement>(null);
    useEffect(() => {}, [tasks]);

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
            {tasks.length === 0 ? (
                <EmptyScreen />
            ) : (
                <Box style={style.scrollable} onScroll={onScroll} ref={box}>
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
            )}
        </>
    );
};

const GridElement = (props: any) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnnotationTask {...props} />
    </Grid>
);

const EmptyScreen = () => {
    return (
        <Box style={style.empty}>
            <Typography variant="h6" align="center">
                Nessun task di annotazione assegnato.
            </Typography>
            <Typography variant="h6" align="center">
                Ricontrolla più tardi!
            </Typography>
        </Box>
    );
};

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
        justifyContent: "center",
        alignItems: "center",
    },
    empty: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column" as "column",
    },
};
