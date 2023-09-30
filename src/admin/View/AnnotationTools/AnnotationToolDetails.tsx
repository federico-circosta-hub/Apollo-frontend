import Box from "@mui/material/Box";
import { DetailItemProps } from "../MasterDetail/DetailComponent";
import AnnotationTypesButtons from "./AnnotationTypesButtons";
import AnnotationTool from "../../../common/Model/AnnotationTool";

export default function AnnotationToolDetails({ item }: DetailItemProps) {
    const tool = item as AnnotationTool;

    return (
        <Box sx={style.box}>
            <AnnotationTypesButtons tool={tool} onTypeSelected={(type) => {}} />
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
