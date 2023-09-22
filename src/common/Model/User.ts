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

    // copy costructor
    constructor(obj: User) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.surname = obj.surname;
        this.type = obj.type;
        this.enabled = obj.enabled;
    }
}
