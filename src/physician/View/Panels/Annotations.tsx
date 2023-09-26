import React from "react";
import AnnotationTask from "../OtherComponents/AnnotationTask";
import { Box, Grid } from "@mui/material";
import PhysicianTask from "../../../common/Model/PhysicianTask";

export default function Annotations() {
    const task = new PhysicianTask({
        id: 1,
        name: "Task 1",
        dataset: 1,
        annotation_type: 2,
        dataset_name: "Dataset 1",
        annotation_type_name: "Annotation Type 1",
        media_cnt: 100,
        annotation_cnt: 30,
        deadline: "2021 - 10 - 10",
        url: "http://www.google.com",
    });
    const task2 = new PhysicianTask({
        id: 1,
        name: "Task 1",
        dataset: 1,
        annotation_type: 2,
        dataset_name: " 1",
        annotation_type_name: " Type 1",
        media_cnt: 100,
        annotation_cnt: 30,
        deadline: "2021 - 10 - 10",
        url: "http://www.google.com",
    });

    const tasks: PhysicianTask[] = [
        task,
        task,
        task2,
        task2,
        task,
        task2,
        task,
        task,
        task2,
        task2,
        task,
        task2,
    ];

    return (
        <div style={style.box}>
            <Box className="box-bianco" style={style.scrollable}>
                <Grid
                    alignItems="top"
                    justifyContent="left"
                    container
                    spacing={2}
                    style={style.grid}
                >
                    {tasks.map((task) => (
                        <GridElement task={task} />
                    ))}
                </Grid>
            </Box>
        </div>
    );
}

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
};
