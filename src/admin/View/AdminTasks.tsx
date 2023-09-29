import { useContext, useEffect } from "react";
import { HeaderContext } from "./AdminHeader";

export default function AdminTasks() {
	const [, setTitle] = useContext(HeaderContext);
	
	useEffect(() => {
        setTitle("Task di annotazione");
    }, [setTitle]);
}