import { useCallback, useContext, useEffect } from "react";
import MainContainer from "../../../common/View/MainContainer";
import { HeaderContext } from "../AdminHeader";
import { AnnotationToolData } from "../../../common/Model/AnnotationTool";
import { AnnotationToolsContext } from "../../ViewModel/AnnotationToolsProvider";
import AnnotationToolFields from "./AnnotationToolFields";
import { useNavigate } from "react-router-dom";

export default function AdminAddTool() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Nuovo tool di annotazione");
    }, [setTitle]);

    const { add: addTool } = useContext(AnnotationToolsContext);

    const navigate = useNavigate();
    const exit = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const saveData = useCallback(
        async (data: AnnotationToolData) => {
            await addTool(data);
            setTimeout(exit, 1000);
            return "Tool di annotazione aggiunto con successo";
        },
        [addTool, exit]
    );

    return (
        <MainContainer>
            <AnnotationToolFields
                onSave={saveData}
                style={{ height: "100%" }}
            />
        </MainContainer>
    );
}
