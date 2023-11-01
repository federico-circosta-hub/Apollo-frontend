import { useCallback, useEffect, useState } from "react";
import Task, { TaskConflictsMatrix } from "../../../common/Model/Task";
import MainCC from "../../../common/Model/Communication/MainCommunicationController";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import User from "../../../common/Model/User";
import Status from "../../../common/Model/Status";
import { Paper } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import LoadingOrError from "../../../common/View/LoadingOrError";

function getData(u1: number, u2: number, matrix: TaskConflictsMatrix) {
    if (u1 !== u2) console.log(matrix[u1][u2].common_annotations);
    return u1 === u2
        ? ["---", "---"]
        : [
              `${Math.round(matrix[u1][u2].conflict_degree * 10000) / 100}%`,
              `${matrix[u1][u2].common_annotations}`,
          ];
}

export default function TaskConflictMatrix({
    task,
    users,
    style,
}: {
    task: Task;
    users: User[];
    style?: any;
}) {
    const [status, setStatus] = useState<Status>(Status.LOADING);
    const [matrix, setMatrix] = useState<TaskConflictsMatrix>();

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);
        try {
            const matrix = await task.conflictMatrix();
            setMatrix(matrix);
            setStatus(Status.IDLE);
        } catch {
            setStatus(Status.ERROR);
        }
    }, [task]);

    useEffect(() => {
        fetchData();
        return () => MainCC.abortLast();
    }, [fetchData]);

    const UserRow = ({ user: userId }: { user: number }) => {
        const user = users.find((u) => u.id === userId);
        if (!user || !matrix) return <></>;

        return (
            <StyledTableRow
                sx={{
                    "&:last-child td, &:last-child th": {
                        border: 0,
                    },
                }}
            >
                <StyledTableCell component="th" scope="row">
                    {user.fullName()}
                </StyledTableCell>
                {task.physicians.map((p) => {
                    const [percent, commons] = getData(user.id, p.user, matrix);

                    return (
                        <Tooltip
                            key={p.user}
                            title={`Annotazioni in comune: ${commons}`}
                        >
                            <StyledTableCell align="right">
                                {percent}
                            </StyledTableCell>
                        </Tooltip>
                    );
                })}
            </StyledTableRow>
        );
    };

    if (status !== Status.IDLE)
        return (
            <LoadingOrError
                status={status}
                errorMsg="Errore nel caricamento della tabella dei conflitti"
                onReload={fetchData}
            />
        );

    return (
        <Paper sx={[baseStyle.box, style]}>
            <TableContainer>
                <Table
                    sx={{
                        minWidth: 650,
                        "& .MuiTableRow-root:hover": {
                            backgroundColor: "primary.light",
                        },
                    }}
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Conflitti</TableCell>
                            {task.physicians.map((p) => {
                                const name = users
                                    .find((u) => u.id === p.user)
                                    ?.fullName();
                                return (
                                    <TableCell key={p.user} align="right">
                                        {name}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {task.physicians.map((userStatus) => (
                            <UserRow
                                key={userStatus.user}
                                user={userStatus.user}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const baseStyle = {
    box: {
        overflow: "auto",
    },
};
