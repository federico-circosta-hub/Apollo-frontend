import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/Communication";
import MasterDetail, { MasterItemProps } from "../MasterDetail/MasterDetail";
import Dataset from "../../../common/Model/Dataset";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

export default function AdminDatasets() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Dataset");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const getDatasets = useContext(DatasetsContext);
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

    return (
        <MasterDetail
            items={datasets}
            itemName="Dataset"
            addRoute="/datasets/add"
            status={status}
            MasterItem={DatasetItem}
            DetailItem={DatasetDetails}
            onRetry={fetchData}
        />
    );
}

const DatasetItem = ({ item, onClick }: MasterItemProps) => {
    const dataset = item as Dataset;

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText
                primary={dataset.name}
                secondary={dataset.typeStr()}
            />
        </ListItemButton>
    );
};

const DatasetDetails = () => {
    return <></>;
};
