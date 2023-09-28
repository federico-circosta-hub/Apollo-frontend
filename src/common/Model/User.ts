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
}
