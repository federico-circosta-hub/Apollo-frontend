import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/CommunicationController";
import Dataset from "../../../common/Model/Dataset";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import MasterComponent from "../MasterDetail/MasterComponent";
import { useNavigate } from "react-router-dom";
import Loading from "../../../common/View/Loading";
import ErrorScreen from "../MasterDetail/ErrorScreen";
import MainContainer from "../../../common/View/MainContainer";
import DatasetItem from "./DatasetItem";

export default function AdminDatasets() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Dataset");
    }, [setTitle]);

    const navigate = useNavigate();
    const [status, setStatus] = useState<Status>(Status.LOADING);

    const { get: getDatasets, delete: deleteDataset } =
        useContext(DatasetsContext);
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getDatasets();

            console.log(`${res.length} datasets recevied`);
            setDatasets(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getDatasets]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    const handleDelete = useCallback(
        async (dataset: Dataset) => {
            await deleteDataset(dataset.id);
            await fetchData();
            return;
        },
        [deleteDataset, fetchData]
    );

    if (status === Status.ERROR) return <ErrorScreen onRetry={fetchData} />;

    return (
        <MainContainer>
            {status === Status.IDLE ? (
                <MasterComponent
                    items={datasets}
                    itemName="Dataset"
                    Item={DatasetItem}
                    onAdd={() => navigate("/datasets/add")}
                    onDelete={handleDelete}
                />
            ) : (
                <Loading />
            )}
        </MainContainer>
    );
}
