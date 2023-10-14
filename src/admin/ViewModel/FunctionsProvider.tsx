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

    const getFunctions = useCallback(async () => {
        if (
            printFunctions.current.length === 0 ||
            conflictFunctions.current.length === 0
        ) {
            const res = await Promise.all([
                CommunicationController.getPrintFunctions(),
                CommunicationController.getConflictFunctions(),
            ]);
            printFunctions.current = res[0];
            conflictFunctions.current = res[1];
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
