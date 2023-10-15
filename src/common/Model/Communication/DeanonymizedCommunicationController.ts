import config from "../../../config";
import User, { UserData, UserType } from "../User";
import AbstractCommunicationController from "./AbstractCommunicationController";

class DeanonymizedCommunicationController extends AbstractCommunicationController {
    SESSION_HEADER_NAME = "ApolloSession";

    private endpoints = {
        GET_PHYSICIANS: "/user/physician",
        LOGIN: "/user/login",
		LOGOUT: "/user/logout",
        RESET_USER_PASSWORD: "/user/resetPassword",
        NEW_PHYSICIAN: "/user/physician",
    };

    protected getHeaders(): { [key: string]: string } {
        const session = localStorage.getItem(config.LOCAL_STORAGE_SESSION_KEY);

        return {
            [this.SESSION_HEADER_NAME]: session ?? "",
        };
    }

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
        const res = await this.post(this.endpoints.LOGIN, { email, password });
		localStorage.setItem(config.LOCAL_STORAGE_SESSION_KEY, res.session.sid);
		localStorage.setItem(config.LOCAL_STORAGE_EXPIRE_KEY, res.session.expire);
        return new User(res);
    };

	logout = async () => {
        await this.post(this.endpoints.LOGOUT);
		localStorage.removeItem(config.LOCAL_STORAGE_SESSION_KEY);
		localStorage.removeItem(config.LOCAL_STORAGE_EXPIRE_KEY);
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
