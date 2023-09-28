import { Dispatch, SetStateAction, createContext, useState } from "react";
import Header from "../../common/View/Header";

export const HeaderContext = createContext<
    [string, Dispatch<SetStateAction<string>>]
>(["Admin", () => ""]);

export default function AdminHeader({
    children,
}: {
    children: React.ReactNode;
}) {
    const [title, setTitle] = useState("Admin");

    return (
        <HeaderContext.Provider value={[title, setTitle]}>
            <Header title={title} leftButton={null} />
            {children}
        </HeaderContext.Provider>
    );
}
