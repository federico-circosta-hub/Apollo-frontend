import LoadingButton from "@mui/lab/LoadingButton";
import Status from "../../common/Model/Status";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SaveIcon from "@mui/icons-material/Save";

export default function StatusLoadingButton({
    text,
    status,
    onClick,
    disabled,
    variant = "contained",
    style,
    icon,
}: {
    text: string;
    status: Status;
    onClick: () => any;
    disabled?: boolean;
    variant?: "contained" | "outlined";
    style?: any;
    icon?: React.ReactNode;
}) {
    return (
        <LoadingButton
            disabled={status === Status.LOADING || disabled}
            loading={status === Status.LOADING}
            loadingPosition="start"
            startIcon={
                icon ? (
                    icon
                ) : status === Status.ERROR ? (
                    <ErrorOutlineIcon />
                ) : (
                    <SaveIcon />
                )
            }
            variant={variant}
            color={status === Status.ERROR ? "error" : "primary"}
            onClick={onClick}
            sx={style}
        >
            {text}
        </LoadingButton>
    );
}
