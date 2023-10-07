import { createContext, useCallback, useRef } from "react";
import User, { UserData } from "../../common/Model/User";
import CommunicationController from "../../common/Model/CommunicationController";

export const PhysiciansContext = createContext<{
    get: () => Promise<User[]>;
    add: (user: UserData) => Promise<User | undefined>;
    getWithTools: () => Promise<User[]>;
}>({
    get: async () => [],
    add: async () => {
        return undefined;
    },
    getWithTools: async () => [],
});

export default function PhysiciansProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const synchronized = useRef<boolean>(false);
    const users = useRef<User[]>([]);

    const getPhysician = useCallback(async () => {
        if (!synchronized.current) {
            const res = await CommunicationController.getPhysicians(true);
            synchronized.current = true;
            users.current.push(...res);
        }
        return users.current;
    }, []);

    const addPhysician = useCallback(async (data: UserData) => {
        const user = await CommunicationController.newPhysician(data);
        users.current.push(user);
        return user;
    }, []);

    const getWithTools = useCallback(async () => {
        await getPhysician();

        const promises = [];
        for (const user of users.current)
            promises.push(user.fetchToolsAccess());

        await Promise.all(promises);

        return users.current;
    }, [getPhysician]);

    return (
        <PhysiciansContext.Provider
            value={{
                get: getPhysician,
                add: addPhysician,
                getWithTools: getWithTools,
            }}
        >
            {children}
        </PhysiciansContext.Provider>
    );
}
