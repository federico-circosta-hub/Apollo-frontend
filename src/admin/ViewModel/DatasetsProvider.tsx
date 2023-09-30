import { createContext, useCallback, useRef } from "react";
import Dataset from "../../common/Model/Dataset";
import CommunicationController from "../../common/Model/CommunicationController";

export const DatasetsContext = createContext<() => Promise<Dataset[]>>(
    async () => []
);

export default function DatasetsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const datasets = useRef<Dataset[]>([]);

    const getDatasets = useCallback(async () => {
        if (datasets.current.length === 0) {
            const res = await CommunicationController.getDatasets();
            datasets.current = res;
        }
        return datasets.current;
    }, []);

    return (
        <DatasetsContext.Provider value={getDatasets}>
            {children}
        </DatasetsContext.Provider>
    );
}
