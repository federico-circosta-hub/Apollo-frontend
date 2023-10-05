import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function AddButton({
    itemName: title,
    onAdd,
    style,
}: {
    itemName: string;
    onAdd: () => void;
    style?: any;
}) {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={style}
            onClick={onAdd}
        >
            {title}
        </Button>
    );
}
