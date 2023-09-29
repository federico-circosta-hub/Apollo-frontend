import CommunicationController from "./Communication";
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

export default class User {
    id: number;
    name: string;
    email: string;
    surname?: string;
    type: UserType;
    enabled: boolean;

    constructor(obj: User | any = {}) {
        this.id = obj.id ?? 0;
        this.name = obj.name ?? "";
        this.email = obj.email ?? "";
        this.surname = obj.surname ?? "";
        this.type = obj.type ?? UserType.PHYSICIAN;
        this.enabled = obj.enabled ?? false;
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
