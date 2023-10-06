import Box from "@mui/material/Box";
import Task from "../../../common/Model/Task";
import Status from "../../../common/Model/Status";
import { useState } from "react";

export default function TaskAssignment({
    task,
    style,
}: {
    task: Task;
    style?: any;
}) {
    const [status, setStatus] = useState<Status>(Status.LOADING);

    return <Box sx={[baseStyle.scrollable, style]}></Box>;
}

const baseStyle = {
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        margin: "auto",
        display: "flex",
        flexDirection: "column" as "column",
    },
};
