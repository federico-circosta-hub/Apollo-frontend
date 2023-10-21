import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useState,
} from "react";
import Header from "../../common/View/Header";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLocation, useNavigate } from "react-router-dom";

export const HeaderContext: React.Context<
    [string, Dispatch<SetStateAction<string>>]
> = createContext<[string, Dispatch<SetStateAction<string>>]>([
    "Admin",
    () => "",
]);

export default function AdminHeader({
    children,
}: {
    children: React.ReactNode;
}) {
    const [title, setTitle] = useState("Admin");
    const navigate = useNavigate();
    const location = useLocation();

    const navigateBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <HeaderContext.Provider value={[title, setTitle]}>
            <Header
                title={title}
                leftButton={
                    location.pathname !== "/" && (
                        <IconButton onClick={navigateBack}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    )
                }
            />
            {children}
        </HeaderContext.Provider>
    );
}
