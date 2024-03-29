import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import User from "../../../common/Model/User";
import MasterDetail from "../MasterDetail/MasterDetail";
import UserDetails from "./UserDetails";
import Status from "../../../common/Model/Status";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";
import { MasterItemProps } from "../MasterDetail/MasterComponent";

export default function AdminUsers() {
    const [, setTitle] = useContext(HeaderContext);
    useEffect(() => {
        setTitle("Utenti");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const { get: getUsers } = useContext(PhysiciansContext);
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getUsers();

            console.log(`${res.length} users recevied`);
            setUsers(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getUsers]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    return (
        <MasterDetail
            items={users}
            itemName="Utente"
            addRoute="/users/add"
            status={status}
            MasterItem={UserItem}
            DetailItem={UserDetails}
            onRetry={fetchData}
        />
    );
}

const UserItem = ({ item, onClick }: MasterItemProps) => {
    const user = item as User;

    const [, setTitle] = useContext(HeaderContext);

    const handleClick = useCallback(() => {
        setTitle(user.fullName());
        onClick();
    }, [setTitle, user, onClick]);

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemAvatar>
                <Avatar
                    sx={{
                        width: 35,
                        height: 35,
                        background: "#4169e1",
                    }}
                >
                    {user.getInitials()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.fullName()} secondary={item.email} />
        </ListItemButton>
    );
};
