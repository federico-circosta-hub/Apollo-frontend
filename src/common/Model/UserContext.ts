import { Dispatch, SetStateAction, createContext } from "react";
import User from "./User";

const UserContext = createContext<
    [User | null, Dispatch<SetStateAction<User | null>>]
>([null, () => null]);

export default UserContext;
