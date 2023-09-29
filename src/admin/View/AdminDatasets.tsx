import { useContext, useEffect } from "react";
import { HeaderContext } from "./AdminHeader";

export default function AdminDatasets() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Dataset");
    }, [setTitle]);
}
