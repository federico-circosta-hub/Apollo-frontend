import { createContext, useCallback, useRef } from "react";
import User, { UserData } from "../../common/Model/User";
import CommunicationController from "../../common/Model/CommunicationController";

export const PhysiciansContext = createContext<{
    get: (includeDisabled: boolean) => Promise<User[]>;
    add: (user: UserData) => Promise<User | undefined>;
    getWithTools: (includeDisabled: boolean) => Promise<User[]>;
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

    const getPhysician = useCallback(
        async (includeDisabled: boolean = true) => {
            if (!synchronized.current) {
                const res = await CommunicationController.getPhysicians(true);
                synchronized.current = true;
                users.current.push(...res);
            }
            if (includeDisabled) return users.current;
            return users.current.filter((u) => u.enabled);
        },
        []
    );

    const addPhysician = useCallback(async (data: UserData) => {
        const user = await CommunicationController.newPhysician(data);
        users.current.push(user);
        return user;
    }, []);

    const getWithTools = useCallback(
        async (includeDisabled: boolean = true) => {
            const res = await getPhysician(includeDisabled);

            const promises = [];
            for (const user of res)
                promises.push(user.fetchToolsAccess());

            await Promise.all(promises);

            return res;
        },
        [getPhysician]
    );

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
