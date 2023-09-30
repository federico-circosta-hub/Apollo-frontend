import { DetailItemProps } from "../MasterDetail/DetailComponent";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import { useEffect, useState } from "react";
import AnnotationType from "../../../common/Model/AnnotationType";
import AnnotationTypeDetails from "./AnnotationTypeDetails";
import Box from "@mui/material/Box";
import AnnotationToolData from "./AnnotationToolData";
import AnnotationToolTypes from "./AnnotationToolTypes";

export default function AnnotationToolDetails({ item }: DetailItemProps) {
    const tool = item as AnnotationTool;

    const [showType, setShowType] = useState<boolean>(false);
    const [type, setType] = useState<AnnotationType | undefined>(undefined);

    useEffect(() => {
        setShowType(false);
        setType(undefined);
    }, [tool]);

    return showType ? (
        <AnnotationTypeDetails
            type={type}
            tool={tool}
            onExit={() => setShowType(false)}
        />
    ) : (
        <AnnotationToolDetailsPage
            tool={tool}
            onTypeSelected={(selected) => {
                setShowType(true);
                setType(selected);
            }}
        />
    );
}

const AnnotationToolDetailsPage = ({
    tool,
    onTypeSelected,
}: {
    tool: AnnotationTool;
    onTypeSelected: (type?: AnnotationType) => void;
}) => {
    return (
        <Box sx={style.box}>
            <AnnotationToolData tool={tool} style={{ height: "75%" }} />
            <Box sx={{ m: 1 }} />
            <AnnotationToolTypes
                tool={tool}
                onTypeSelected={onTypeSelected}
                style={{ flex: 1 }}
            />
        </Box>
    );
};

const style = {
    box: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
    },
};
