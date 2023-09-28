export enum UserType {
    ADMIN = "admin",
    PHYSICIAN = "physician",
    OPERATOR = "operator",
}

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
}
