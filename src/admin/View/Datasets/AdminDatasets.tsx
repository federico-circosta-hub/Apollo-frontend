import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/Communication";
import Dataset from "../../../common/Model/Dataset";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import MasterComponent, {
    MasterItemProps,
} from "../MasterDetail/MasterComponent";
import { useNavigate } from "react-router-dom";
import Loading from "../../../common/View/Loading";
import ErrorScreen from "../MasterDetail/ErrorScreen";
import MainContainer from "../../../common/View/MainContainer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DatasetItem from "./DatasetItem";

export default function AdminDatasets() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Dataset");
    }, [setTitle]);

    const navigate = useNavigate();
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

    if (status === Status.ERROR) return <ErrorScreen onRetry={fetchData} />;

    return (
        <MainContainer>
            {status === Status.IDLE ? (
                <MasterComponent
                    items={datasets}
                    itemName="Dataset"
                    Item={DatasetItem}
                    onAddClick={() => navigate("/datasets/add")}
                />
            ) : (
                <Loading />
            )}
        </MainContainer>
    );
}
