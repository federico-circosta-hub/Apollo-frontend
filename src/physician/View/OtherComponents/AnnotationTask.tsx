import {
    Card,
    CardContent,
    Typography,
    Box,
    CardActionArea,
    styled,
    LinearProgress,
    linearProgressClasses,
} from "@mui/material";
import PhysicianTask from "../../../common/Model/PhysicianTask";

const AnnotationTask = ({ task }: { task: PhysicianTask }) => {
    const openTask = () => {
        window.open(task.url, "_blank");
    };

    return (
        <Card style={style.card} variant="outlined" raised>
            <CardActionArea onClick={openTask}>
                <CardContent>
                    <Typography variant="h6" component="div" sx={style.title}>
                        {task.name()}
                    </Typography>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                        Deadline: {task.deadline}
                    </Typography>

                    <Box sx={{ m: 6 }} />

                    <BorderLinearProgress
                        variant="determinate"
                        value={task.progress() * 100}
                    />
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 16,
    borderRadius: 10,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
}));

const style = {
    card: {
        background: "#6dacc6",
        borderRadius: "15px",
    },
    title: {
        overflow: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
    },
};

export default AnnotationTask;
