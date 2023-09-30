import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../AdminHeader";
import Status from "../../../common/Model/Status";
import CommunicationController from "../../../common/Model/CommunicationController";
import MasterDetail from "../MasterDetail/MasterDetail";
import { MasterItemProps } from "../MasterDetail/MasterComponent";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import { AnnotationToolsContext } from "../../ViewModel/AnnotationToolsProvider";
import AnnotationToolDetails from "./AnnotationToolDetails";

export default function AdminTools() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Tool di annotazione");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const getTools = useContext(AnnotationToolsContext);
    const [tools, setTools] = useState<AnnotationTool[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getTools();

            console.log(`${res.length} annotation tools recevied`);
            setTools(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [getTools]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    return (
        <MasterDetail
            items={tools}
            itemName="Tool"
            addRoute="/tools/add"
            status={status}
            MasterItem={AnnotationToolItem}
            DetailItem={AnnotationToolDetails}
            onRetry={fetchData}
            onDelete={async (tool: AnnotationTool) => {}}
        />
    );
}

const AnnotationToolItem = ({ item, onClick }: MasterItemProps) => {
    const tool = item as AnnotationTool;

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText primary={tool.name} />
        </ListItemButton>
    );
};
