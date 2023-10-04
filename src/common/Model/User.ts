import CommunicationController from "./CommunicationController";
import PhysicianTask from "./PhysicianTask";

export enum UserType {
    ADMIN = "admin",
    PHYSICIAN = "physician",
    OPERATOR = "operator",
}

export type AnnotationToolAccess = {
    id: number;
    name: string;
    endpoint: string;
    access: boolean;
};

export const isUserEmailValid = (email: string): boolean => {
    email = email.trim();
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export const isUserValid = (data: UserData): boolean => {
    return (
        data.name.trim() !== "" &&
        data.surname.trim() !== "" &&
        isUserEmailValid(data.email)
    );
};

export type UserDataKey = keyof UserData;

export class UserData {
    email: string = "";
    name: string = "";
    surname: string = "";
}

export default class User {
    id: number;
    email: string;
    name: string;
    surname?: string;
    type: UserType;
    enabled: boolean;
    password?: string;

    constructor(obj: User) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.surname = obj.surname;
        this.type = obj.type;
        this.enabled = obj.enabled;
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

    toggleEnabled = async (): Promise<boolean> => {
        const enabled = await CommunicationController.toggleUserEnabled(
            this.id
        );
        this.enabled = enabled;
        return this.enabled;
    };

    annotationTools = async (): Promise<AnnotationToolAccess[]> => {
        return await CommunicationController.getUserAnnotationTool(this.id);
    };

    toggleAnnotationToolAccess = async (
        annotationToolId: number,
        access: boolean,
        endpoint?: string
    ): Promise<string> => {
        return await CommunicationController.toggleUserAnnotationToolAccess(
            this.id,
            annotationToolId,
            access,
            endpoint
        );
    };

    tasks = async (
        includeCompleted: boolean = false
    ): Promise<PhysicianTask[]> => {
        return await CommunicationController.getPhysicianTasks(
            this.id,
            includeCompleted
        );
    };
}
