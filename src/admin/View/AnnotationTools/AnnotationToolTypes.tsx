import { useCallback, useEffect, useState } from "react";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import Status from "../../../common/Model/Status";
import AnnotationType from "../../../common/Model/AnnotationType";
import CommunicationController from "../../../common/Model/CommunicationController";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingError from "../../../common/View/LoadingError";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

export default function AnnotationToolTypes({
    tool,
    onTypeSelected,
    style,
}: {
    tool: AnnotationTool;
    onTypeSelected: (type?: AnnotationType) => void;
    style?: any;
}) {
    const [status, setStatus] = useState<Status>(Status.LOADING);

    const [types, setTypes] = useState<AnnotationType[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await tool.getTypes();

            console.log(`${res.length} annotation types recevied`);
            setTypes(res);
            setStatus(Status.IDLE);
        } catch (err: any) {
            setStatus(Status.ERROR);
        }
    }, [tool]);

    useEffect(() => {
        fetchData();
        return () => CommunicationController.abortLast();
    }, [fetchData]);

    if (status !== Status.IDLE) {
        <LoadingError
            status={status}
            errorMsg="Errore nel caricamento dei tipi di annotazione supportati"
            onReload={fetchData}
        />;
    }

    return (
        <Box sx={[baseStyle.box, style]}>
            <Typography variant="h5">
                Tipi di annotazione supportati:
            </Typography>
            <Box sx={baseStyle.scrollable}>
                <Grid container spacing={2} sx={baseStyle.grid}>
                    {types.map((type) => (
                        <AnnotationTypeItem
                            key={type.id}
                            type={type}
                            onTypeSelected={onTypeSelected}
                        />
                    ))}
                    <Grid item>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => onTypeSelected()}
                        >
                            Nuovo tipo
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

const AnnotationTypeItem = ({
    type,
    onTypeSelected,
}: {
    type: AnnotationType;
    onTypeSelected: (type: AnnotationType) => void;
}) => {
    return (
        <Grid item>
            <Button
                variant="contained"
                sx={baseStyle.button}
                onClick={() => onTypeSelected(type)}
            >
                {type.name}
            </Button>
        </Grid>
    );
};

const baseStyle = {
    box: {
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
    },
    grid: {
        padding: "4px",
    },
    button: {
        textTransform: "none",
    },
};
