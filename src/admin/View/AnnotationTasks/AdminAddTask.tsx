import { useCallback, useContext, useEffect, useState } from "react";
import MainContainer from "../../../common/View/MainContainer";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import { DatasetsContext } from "../../ViewModel/DatasetsProvider";
import { AnnotationToolsContext } from "../../ViewModel/AnnotationToolsProvider";
import Dataset from "../../../common/Model/Dataset";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import LoadingSpinner from "../../../common/View/LoadingSpinner";
import ErrorScreen from "../../../common/View/ErrorScreen";
import AnnotationTaskAddForm from "./TaskAddForm";
import User from "../../../common/Model/User";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";

export default function AdminAddTask() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Nuovo task di annotazione");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.IDLE);

    const { get: getDatasets } = useContext(DatasetsContext);
    const { getWithTypes: getTools } = useContext(AnnotationToolsContext);
    const { getWithTools: getUsers } = useContext(PhysiciansContext);

    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [tools, setTools] = useState<AnnotationTool[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        let promises = [];
        try {
            promises.push(getDatasets());
            promises.push(getTools());
            promises.push(getUsers());

            const res = await Promise.all(promises);

            setDatasets((res[0] as Dataset[]).filter((d) => d.completed));
            setTools(res[1] as AnnotationTool[]);
            setUsers(res[2] as User[]);

            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getDatasets, getTools, getUsers]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (status === Status.LOADING)
        return (
            <MainContainer>
                <LoadingSpinner />
            </MainContainer>
        );

    if (status === Status.ERROR) return <ErrorScreen onRetry={fetchData} />;

    return (
        <AnnotationTaskAddForm
            datasets={datasets}
            tools={tools}
            users={users}
        />
    );
}
