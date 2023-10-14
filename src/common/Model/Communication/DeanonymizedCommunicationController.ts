import config from "../../../config";
import User, { UserData, UserType } from "../User";
import AbstractCommunicationController from "./AbstractCommunicationController";

class DeanonymizedCommunicationController extends AbstractCommunicationController {
    SESSION_COOKIE_NAME = "connect.sid";

    private endpoints = {
        GET_PHYSICIANS: "/user/physician",
        LOGIN: "/user/login",
        RESET_USER_PASSWORD: "/user/resetPassword",
        TOGGLE_USER_ENABLED: "/user/enable",
        NEW_PHYSICIAN: "/user/physician",
    };

    getPhysicians = async (
        includeDisabled: boolean = false,
        id?: number
    ): Promise<User[]> => {
        const users = await this.get(this.endpoints.GET_PHYSICIANS, {
            includeDisabled,
            id,
        });

        return users.map((user: User) => new User(user));
    };

    login = async (email?: string, password?: string): Promise<User> => {
        const user = await this.post(this.endpoints.LOGIN, { email, password });
        return new User(user);
    };

    generateNewPassword = async (email: string): Promise<string> => {
        const res = await this.post(this.endpoints.RESET_USER_PASSWORD, {
            email,
        });
        return res.password;
    };

    resetPassword = async (
        email: string,
        oldPassword: string,
        newPassword: string
    ): Promise<string> => {
        const res = await this.post(this.endpoints.RESET_USER_PASSWORD, {
            email,
            oldPassword,
            newPassword,
        });
        return res.password;
    };

    toggleUserEnabled = async (id: number): Promise<boolean> => {
        const res = await this.patch(this.endpoints.TOGGLE_USER_ENABLED, {
            id,
        });
        return res.enabled;
    };

    newPhysician = async (data: UserData): Promise<User> => {
        const res = await this.post(this.endpoints.NEW_PHYSICIAN, {
            ...data,
            type: UserType.PHYSICIAN,
        });
        return new User(res);
    };
}

const instance = new DeanonymizedCommunicationController(
    config.DEANONYMIZED_API_URL
);

export default instance;
