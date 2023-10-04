import { createContext, useCallback, useRef } from "react";
import Dataset, { DatasetData } from "../../common/Model/Dataset";
import CommunicationController from "../../common/Model/CommunicationController";

export const DatasetsContext = createContext<{
    get: () => Promise<Dataset[]>;
    delete: (datasetId: number) => Promise<void>;
    add: (dataset: DatasetData) => Promise<Dataset | undefined>;
}>({
    get: async () => [],
    add: async () => {
        return undefined;
    },
    delete: async () => {},
});

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

    const addDataset = useCallback(async (data: DatasetData) => {
        const dataset = await CommunicationController.newDataset(data);
        datasets.current.push(dataset);
        return dataset;
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
