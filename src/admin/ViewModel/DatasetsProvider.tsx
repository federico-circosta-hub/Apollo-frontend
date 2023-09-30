import { createContext, useCallback, useRef } from "react";
import Dataset from "../../common/Model/Dataset";
import CommunicationController from "../../common/Model/CommunicationController";

export const DatasetsContext = createContext<{
    get: () => Promise<Dataset[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: Dataset) => Promise<void>;
}>({ get: async () => [], add: async () => {}, delete: async () => {} });

export default function DatasetsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const synchronized = useRef<boolean>(false);
    const datasets = useRef<Dataset[]>([]);

    const getDatasets = useCallback(async () => {
        if (!synchronized.current) {
            const res = await CommunicationController.getDatasets();
            synchronized.current = true;
            datasets.current.push(...res);
        }
        return datasets.current;
    }, []);

    const addDataset = useCallback(async (dataset: Dataset) => {
        //const res = await CommunicationController.newDataset(dataset);
        datasets.current.push(dataset);
    }, []);

    const removeDataset = useCallback(async (datasetId: number) => {
        await CommunicationController.deleteDataset(datasetId);
        datasets.current = datasets.current.filter((d) => d.id !== datasetId);
    }, []);

    return (
        <DatasetsContext.Provider
            value={{ get: getDatasets, add: addDataset, delete: removeDataset }}
        >
            {children}
        </DatasetsContext.Provider>
    );
}
