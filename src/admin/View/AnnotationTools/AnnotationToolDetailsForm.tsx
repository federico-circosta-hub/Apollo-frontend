import Box from "@mui/material/Box";
import AnnotationToolForm from "./AnnotationToolForm";
import AnnotationTypesButtons from "./AnnotationTypesButtons";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import AnnotationType from "../../../common/Model/AnnotationType";

export default function AnnotationToolDetailsForm({
    tool,
    onTypeSelected,
}: {
    tool: AnnotationTool;
    onTypeSelected: (type?: AnnotationType) => void;
}) {
    return (
        <Box sx={style.box}>
            <AnnotationToolForm tool={tool} style={{ height: "75%" }} />
            <Box sx={{ m: 1 }} />
            <AnnotationTypesButtons
                tool={tool}
                onTypeSelected={onTypeSelected}
                style={{ flex: 1 }}
            />
        </Box>
    );
}

const style = {
    box: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
    },
};
