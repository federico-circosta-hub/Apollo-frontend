import { useContext, useEffect } from "react";
import { HeaderContext } from "./AdminHeader";

export default function AdminUsers() {
    const [, setTitle] = useContext(HeaderContext);

    useEffect(() => {
        setTitle("Utenti");
    }, [setTitle]);
}
