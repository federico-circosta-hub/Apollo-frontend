import MainCC from "./Communication/MainCommunicationController";
import PhysicianTask from "./PhysicianTask";

export enum UserType {
    ADMIN = "admin",
    PHYSICIAN = "physician",
    OPERATOR = "operator",
}

export type AnnotationToolAccess = {
    id: number;
    name: string;
    endpoint?: string;
    access: boolean;
};

export const isUserEmailValid = (email: string): boolean => {
    email = email.trim();
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export const isUserValid = (data: UserData): boolean => {
    return (
        data.name.trim() !== "" &&
        data.surname !== undefined &&
        data.surname.trim() !== "" &&
        isUserEmailValid(data.email)
    );
};

export type UserDataKey = keyof UserData;

export class UserData {
    email: string = "";
    name: string = "";
    surname?: string = "";
}

export default class User {
    id: number;
    email: string;
    name: string;
    surname?: string;
    type: UserType;
    password?: string;

    toolsAccess: AnnotationToolAccess[] = [];
    private _toolsSynchronized: boolean = false;

    constructor(obj: User) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.surname = obj.surname;
        this.type = obj.type;
        this.password = obj.password;
    }

    getInitials = (): string => {
        return this.surname
            ? this.name[0].toUpperCase() + this.surname[0].toUpperCase()
            : this.name[0].toUpperCase();
    };

    fullName = (): string => {
        return this.surname ? `${this.name} ${this.surname}` : this.name;
    };

    filter = (search: string): boolean => {
        return this.fullName().toLowerCase().includes(search.toLowerCase());
    };

    fetchToolsAccess = async (): Promise<AnnotationToolAccess[]> => {
        if (!this._toolsSynchronized) {
            this.toolsAccess = await MainCC.getUserAnnotationTool(this.id);
            this._toolsSynchronized = true;
        }
        return this.toolsAccess;
    };

    toggleAnnotationToolAccess = async (
        annotationToolId: number,
        access: boolean,
        endpoint?: string
    ): Promise<string> => {
        const instructions = await MainCC.toggleUserAnnotationToolAccess(
            this.id,
            annotationToolId,
            access,
            endpoint
        );

        this.toolsAccess = this.toolsAccess.map((tool) => {
            if (tool.id === annotationToolId) {
                tool.access = access;
                tool.endpoint = endpoint;
            }
            return tool;
        });

        return instructions;
    };

    tasks = (includeCompleted: boolean = false): Promise<PhysicianTask[]> => {
        return MainCC.getPhysicianTasks(this.id, includeCompleted);
    };

    getData = (): UserData => {
        return {
            email: this.email,
            name: this.name,
            surname: this.surname,
        };
    };
}
