import { createContext, useCallback, useRef } from "react";
import User from "../../common/Model/User";
import CommunicationController from "../../common/Model/CommunicationController";

export const UsersContext = createContext<() => Promise<User[]>>(
    async () => []
);

export default function UsersProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const users = useRef<User[]>([]);

    const getUsers = useCallback(async () => {
        if (users.current.length === 0) {
            const res = await CommunicationController.getPhysicians(true);
            users.current = res;
        }
        return users.current;
    }, []);

    return (
        <UsersContext.Provider value={getUsers}>
            {children}
        </UsersContext.Provider>
    );
}
