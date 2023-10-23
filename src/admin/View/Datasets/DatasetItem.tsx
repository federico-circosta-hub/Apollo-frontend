import ListItemButton from "@mui/material/ListItemButton";
import Dataset from "../../../common/Model/Dataset";
import { MasterItemProps } from "../MasterDetail/MasterComponent";
import ListItemText from "@mui/material/ListItemText";
import { useCallback, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ConfirmActionModal from "../../../common/View/Modal/ConfirmActionModal";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
}

export default function DatasetItem({
    item,
    onClick,
    onDelete,
}: MasterItemProps) {
    const dataset = item as Dataset;

    return (
        <ListItemButton onClick={onClick} sx={style.container}>
            <ListItemText
                primary={dataset.name}
                secondary={<CompletedSwitch dataset={dataset} />}
                sx={style.textItem}
            />
            <ListItemText
                sx={style.datesText}
                primary={
                    dataset.start_date
                        ? `Da: ${formatDate(dataset.start_date)}`
                        : undefined
                }
                secondary={
                    dataset.end_date
                        ? `A: ${formatDate(dataset.end_date)}`
                        : undefined
                }
                primaryTypographyProps={{ align: "right", marginRight: "24px" }}
                secondaryTypographyProps={{
                    align: "right",
                    marginRight: "24px",
                }}
            />
            <ListItemText
                sx={style.descriptionText}
                primary={dataset.description}
                primaryTypographyProps={{ marginLeft: "24px" }}
            />
            <ListItemText
                primary={dataset.media_count}
                secondary={dataset.typeStr()}
                primaryTypographyProps={{ align: "right" }}
                secondaryTypographyProps={{ align: "right" }}
                sx={style.textItem}
            />
            <ListItemIcon
                sx={{ display: "flex", flexDirection: "row-reverse" }}
            >
                <IconButton onClick={onDelete}>
                    <DeleteForeverIcon color="error" />
                </IconButton>
            </ListItemIcon>
        </ListItemButton>
    );
}

const CompletedSwitch = ({ dataset }: { dataset: Dataset }) => {
    const [completed, setCompleted] = useState<boolean>(dataset.completed);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const setDatasetCompleted = useCallback(async () => {
        const completed = await dataset.setCompleted();
        setCompleted(completed);
    }, [dataset]);

    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={completed || dataset.isEmpty()}
                        checked={completed}
                        onChange={() => setShowConfirmModal(true)}
                    />
                }
                label="Completato"
            />
            <ConfirmActionModal
                text="Sei sicuro di voler completare il dataset?"
                show={showConfirmModal}
                onConfirm={setDatasetCompleted}
                onClose={() => setShowConfirmModal(false)}
            />
        </>
    );
};

const style = {
    container: {
        display: "flex",
        flexDirection: "row" as "row",
    },
    textItem: {
        flex: 1,
    },
    datesText: {
        flex: 1,
        display: { xs: "none", sm: "block" },
    },
    descriptionText: {
        flex: 2,
        display: { xs: "none", md: "block" },
    },
};
