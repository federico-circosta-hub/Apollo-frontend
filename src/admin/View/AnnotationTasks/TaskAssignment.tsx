import Box from "@mui/material/Box";
import MasterComponent, {
    MasterItemProps,
} from "../MasterDetail/MasterComponent";
import ListItem from "@mui/material/ListItem";
import User from "../../../common/Model/User";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/it";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCallback, useEffect, useState } from "react";
import Task, { AssignmentType } from "../../../common/Model/Task";
import dayjs, { Dayjs } from "dayjs";

function tomorrowStr() {
    return dayjs().add(1, "day").toISOString();
}

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
                user: user.id,
                assign: false,
                deadline: tomorrowStr(),
            };
        })
    );

    useEffect(() => {
        if (!task) return;

        setData((prev) => {
            for (let i = 0; i < prev.length; i++) {
                const physician = task.physicians.find(
                    (p) => p.user === prev[i].user
                );
                if (physician) {
                    prev[i].assign = true;
                    prev[i].deadline = physician.deadline;
                } else {
                    prev[i].assign = false;
                    prev[i].deadline = tomorrowStr();
                }
            }
            return prev;
        });
    }, [task]);

    useEffect(() => {
        let newData: AssignmentType[] = [];
        setData((prev) => {
            for (const user of users) {
                const assignment = prev.find((p) => p.user === user.id);
                if (assignment) newData.push(assignment);
                else {
                    newData.push({
                        user: user.id,
                        assign: false,
                        deadline: tomorrowStr(),
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
                setData([...data]);
                onAssignmentChange(data);
            },
            [i]
        );

        const handleDeadlineChange = useCallback(
            (date: Dayjs | null) => {
                data[i].deadline = date?.toISOString();
                setData([...data]);
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
                        value={dayjs(data[i].deadline ?? dayjs().add(1, "day"))}
                        onChange={(date) => handleDeadlineChange(date)}
                        minDate={dayjs().add(1, "day")}
                        slotProps={{
                            textField: {
                                error:
                                    data[i].assign &&
                                    data[i].deadline !== undefined &&
                                    dayjs(data[i].deadline).isSame(dayjs()),
                            },
                        }}
                    />
                </LocalizationProvider>
            </ListItem>
        );
    };

    return (
        <Box sx={[baseStyle.box, style]}>
            <MasterComponent
                items={users}
                Item={UserAssignmentItem}
                itemName="Utente"
            />
        </Box>
    );
}

const baseStyle = {
    box: {
        overflow: "auto",
    },
};
