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
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function AdminTools() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Tool di annotazione");
    }, [setTitle]);

    const [status, setStatus] = useState<Status>(Status.LOADING);

    const { get: getTools, delete: deleteTool } = useContext(
        AnnotationToolsContext
    );
    const [tools, setTools] = useState<AnnotationTool[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await getTools();
			res.sort((a, b) => a.name.localeCompare(b.name));

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

    const handleDelete = useCallback(
        async (tool: AnnotationTool) => {
            await deleteTool(tool.id);
            await fetchData();
            return;
        },
        [deleteTool, fetchData]
    );

    return (
        <MasterDetail
            items={tools}
            itemName="Tool"
            addRoute="/tools/add"
            status={status}
            MasterItem={AnnotationToolItem}
            DetailItem={AnnotationToolDetails}
            onRetry={fetchData}
            onDelete={handleDelete}
        />
    );
}

const AnnotationToolItem = ({ item, onClick, onDelete }: MasterItemProps) => {
    const tool = item as AnnotationTool;

    return (
        <ListItemButton onClick={onClick}>
            <ListItemText primary={tool.name} />
            <ListItemIcon
                sx={{ display: "flex", flexDirection: "row-reverse" }}
            >
                <IconButton onClick={onDelete}>
                    <DeleteForeverIcon color="error" />
                </IconButton>
            </ListItemIcon>
        </ListItemButton>
    );
};
