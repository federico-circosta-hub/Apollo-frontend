import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/Communication/MainCommunicationController";
import Dataset from "../../../common/Model/Dataset";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import MasterComponent from "../MasterDetail/MasterComponent";
import { useNavigate } from "react-router-dom";
import Loading from "../../../common/View/Loading";
import ErrorScreen from "../../../common/View/ErrorScreen";
import MainContainer from "../../../common/View/MainContainer";
import DatasetItem from "./DatasetItem";
import EmptyScreen from "../MasterDetail/EmptyScreen";

export default function AdminDatasets() {
    const itemName = "Dataset";

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
            res.sort((a, b) => a.name.localeCompare(b.name));

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

    const onAdd = useCallback(() => {
        navigate("/datasets/add");
    }, [navigate]);

    const handleDelete = useCallback(
        async (dataset: Dataset) => {
            await deleteDataset(dataset.id);
            await fetchData();
            return;
        },
        [deleteDataset, fetchData]
    );

    if (status === Status.ERROR) return <ErrorScreen onRetry={fetchData} />;
    if (status !== Status.LOADING && datasets.length === 0)
        return <EmptyScreen itemName={itemName} onAdd={onAdd} />;

    return (
        <MainContainer>
            {status === Status.IDLE ? (
                <MasterComponent
                    items={datasets}
                    itemName={itemName}
                    Item={DatasetItem}
                    onAdd={onAdd}
                    onDelete={handleDelete}
                />
            ) : (
                <Loading />
            )}
        </MainContainer>
    );
}
