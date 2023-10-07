import Box from "@mui/material/Box";
import MasterComponent, {
    MasterItemProps,
} from "../MasterDetail/MasterComponent";
import ListItem from "@mui/material/ListItem";
import User from "../../../common/Model/User";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/it";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Task from "../../../common/Model/Task";

type AssignmentType = {
    id: number;
    assign: boolean;
    deadline: Dayjs | null;
};

export default function TaskAssignment({
    task,
    users,
    style,
    onAssignmentChange,
}: {
    task?: Task | undefined;
    users: User[];
    style?: any;
    onAssignmentChange: (data: AssignmentType[]) => void;
}) {
    const [data, setData] = useState<AssignmentType[]>(
        users.map((user) => {
            return {
                id: user.id,
                assign: false,
                deadline: null,
            };
        })
    );

    useEffect(() => {
        if (!task) return;

        setData((prev) => {
            for (let i = 0; i < prev.length; i++) {
                const physician = task.physicians.find(
                    (p) => p.id === prev[i].id
                );
                if (physician) {
                    prev[i].assign = true;
                    prev[i].deadline = dayjs(physician.deadline);
                } else {
                    prev[i].assign = false;
                    prev[i].deadline = null;
                }
            }
            return prev;
        });
    }, [task]);

    useEffect(() => {
        let newData: AssignmentType[] = [];
        setData((prev) => {
            for (const user of users) {
                const assignment = prev.find((p) => p.id === user.id);
                if (assignment) newData.push(assignment);
                else {
                    newData.push({
                        id: user.id,
                        assign: false,
                        deadline: null,
                    });
                }
            }
            return newData;
        });
    }, [users]);

    const UserAssignmentItem = ({ item, index: i }: MasterItemProps) => {
        const user = item as User;

        const handleAssignmentChange = useCallback(
            (assigned: boolean) => {
                data[i].assign = assigned;
                setData(data);
                onAssignmentChange(data);
            },
            [i]
        );

        const hadleDeadlineChange = useCallback(
            (date: Dayjs | null) => {
                data[i].deadline = date;
                setData(data);
                onAssignmentChange(data);
            },
            [i]
        );

        if (data.length === 0) return <></>;

        return (
            <ListItem>
                <Checkbox
                    checked={data[i].assign}
                    onChange={(e) => handleAssignmentChange(e.target.checked)}
                />
                <ListItemText
                    primary={user.fullName()}
                    secondary={item.email}
                    sx={{ width: "50%", marginLeft: "16px" }}
                />
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="it"
                >
                    <DatePicker
                        label="Deadline"
                        value={data[i].deadline ?? null}
                        onChange={(date) => hadleDeadlineChange(date)}
                        disablePast
                    />
                </LocalizationProvider>
            </ListItem>
        );
    };

    return (
        <>
            <Typography variant="h5" sx={style}>
                Assegna a:
            </Typography>
            <Box sx={[style, baseStyle.box]}>
                <MasterComponent
                    items={users}
                    Item={UserAssignmentItem}
                    itemName="Utente"
                />
            </Box>
        </>
    );
}

const baseStyle = {
    box: {
        marginTop: "8px",
        overflow: "auto",
    },
};
