import { DetailItemProps } from "../MasterDetail/DetailComponent";
import AnnotationTool from "../../../common/Model/AnnotationTool";
import { useEffect, useState } from "react";
import AnnotationType from "../../../common/Model/AnnotationType";
import AnnotationTypeDetails from "./AnnotationTypeDetails";
import AnnotationToolDetailsForm from "./AnnotationToolDetailsForm";

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
        <AnnotationToolDetailsForm
            tool={tool}
            onTypeSelected={(selected) => {
                setShowType(true);
                setType(selected);
            }}
        />
    );
}
