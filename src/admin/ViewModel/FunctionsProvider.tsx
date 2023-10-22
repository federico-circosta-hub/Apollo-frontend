import { createContext, useCallback, useRef } from "react";
import CommunicationController from "../../common/Model/Communication/MainCommunicationController";

export const FunctionsContext = createContext<
    () => Promise<{ print: string[]; conflict: string[] }>
>(async () => {
    return { print: [], conflict: [] };
});

export default function FunctionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const printFunctions = useRef<string[]>([]);
    const conflictFunctions = useRef<string[]>([]);
    const synchronized = useRef<boolean>(false);

    const getFunctions = useCallback(async () => {
        if (!synchronized.current) {
            const res = await Promise.all([
                CommunicationController.getPrintFunctions(),
                CommunicationController.getConflictFunctions(),
            ]);
            synchronized.current = true;

            printFunctions.current = res[0];
            conflictFunctions.current = res[1];

            printFunctions.current.sort((f1, f2) => f1.localeCompare(f2));
            conflictFunctions.current.sort((f1, f2) => f1.localeCompare(f2));
        }

        return {
            print: printFunctions.current,
            conflict: conflictFunctions.current,
        };
    }, []);

    return (
        <FunctionsContext.Provider value={getFunctions}>
            {children}
        </FunctionsContext.Provider>
    );
}
