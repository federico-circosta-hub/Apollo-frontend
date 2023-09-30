import { useCallback, useEffect, useState } from "react";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import Status from "../../../common/Model/Status";
import AnnotationType from "../../../common/Model/AnnotationType";
import CommunicationController from "../../../common/Model/Communication";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingError from "../../../common/View/LoadingError";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

export default function AnnotationTypesButtons({
    tool,
    onTypeSelected,
}: {
    tool: AnnotationTool;
    onTypeSelected: (type: AnnotationType) => void;
}) {
    const [status, setStatus] = useState<Status>(Status.LOADING);

    const [types, setTypes] = useState<AnnotationType[]>([]);

    const fetchData = useCallback(async () => {
        setStatus(Status.LOADING);

        try {
            const res = await tool.types();

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
        <Box sx={style.box}>
            <Typography sx={{ flex: 1 }} variant="h5">
                Tipi di annotazione supportati:
            </Typography>
            <Box sx={style.scrollable}>
                <Grid container spacing={2} sx={style.grid}>
                    {types.map((type) => (
                        <AnnotationTypeItem
                            type={type}
                            onTypeSelected={onTypeSelected}
                        />
                    ))}
                    <Grid item>
                        <Button variant="outlined" startIcon={<AddIcon />}>
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
                sx={style.button}
                onClick={() => onTypeSelected(type)}
            >
                {type.name}
            </Button>
        </Grid>
    );
};

const style = {
    box: {
        maxHeight: "30%",
        display: "flex",
        flexDirection: "column" as "column",
    },
    scrollable: {
        maxHeight: "100%",
        width: "100%",
        overflow: "auto",
        margin: "auto",
    },
    grid: {
        padding: "4px",
    },
    button: {
        textTransform: "none",
    },
};
