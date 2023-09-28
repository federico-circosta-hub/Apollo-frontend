import { useContext, useEffect } from "react";
import { HeaderContext } from "./AdminHeader";

export default function AdminTools() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Tool di annotazione");
    }, [setTitle]);
}
