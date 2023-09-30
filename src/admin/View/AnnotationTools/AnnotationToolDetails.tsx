import Box from "@mui/material/Box";
import { DetailItemProps } from "../MasterDetail/DetailComponent";
import AnnotationTypesButtons from "./AnnotationTypesButtons";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import AnnotationToolForm from "./AnnotationToolForm";

export default function AnnotationToolDetails({ item }: DetailItemProps) {
    const tool = item as AnnotationTool;

    return (
        <Box sx={style.box}>
            <AnnotationToolForm tool={tool} style={{ height: "69%" }} />
            <Box sx={{ m: 1 }} />
            <AnnotationTypesButtons
                tool={tool}
                onTypeSelected={(type) => {}}
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
