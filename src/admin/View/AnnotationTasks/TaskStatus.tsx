import Box from "@mui/material/Box";
import Task from "../../../common/Model/Task";
import MasterComponent, {
    MasterItemProps,
} from "../MasterDetail/MasterComponent";
import User from "../../../common/Model/User";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

type PhysicianTaskStatus = User & {
    annotated_media: number;
    deadline: string;
    total: number;
};

export default function TaskStatus({
    task,
    users,
    style,
}: {
    task: Task;
    users: User[];
    style?: any;
}) {
    const taskUsers = users
        .filter(
            (user) =>
                task.physicians.find((p) => p.user === user.id) !== undefined
        )
        .map((user) => {
            const p = task.physicians.find((p) => p.user === user.id);
            return {
                ...user,
                deadline: p!.deadline,
                annotated_media: p!.annotated_media,
                total: task.media_count,
            };
        });

    return (
        <>
            <Typography variant="h5">Progresso:</Typography>
            <Box sx={[baseStyle.box, style]}>
                <MasterComponent
                    items={taskUsers}
                    Item={TaskStatusItem}
                    itemName=""
                />
            </Box>
        </>
    );
}

const TaskStatusItem = ({ item }: MasterItemProps) => {
    const status = item as PhysicianTaskStatus;

    return (
        <ListItem>
            <ListItemText primary={status.fullName()} secondary={item.email} />
            <ListItemText
                primary={`${(status.annotated_media / status.total) * 100}% (${
                    status.annotated_media
                }/${status.total})`}
                secondary={status.deadline}
                secondaryTypographyProps={
                    dayjs().isAfter(dayjs(status.deadline))
                        ? {
                              color: "red",
                          }
                        : undefined
                }
                sx={{ textAlign: "right" }}
            />
        </ListItem>
    );
};

const baseStyle = {
    box: {
        overflow: "auto",
    },
};
