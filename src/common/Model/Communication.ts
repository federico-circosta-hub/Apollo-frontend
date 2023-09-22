import axios from "axios";
import config from "../../config";
import User from "./User";

type Params = { [key: string]: any };
type Result = any;

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
}

class Communication {
    controller = axios.create({
        baseURL: config.API_URL,
        timeout: 1000,
        headers: { "Content-Type": "application/json" },
    });

    private endpoints = {
        GET_PHYSICIANS: "/user/physician",
    };

    private baseCall = async (
        method: HttpMethod,
        endpoint: string,
        data: Params
    ): Promise<Result> => {
        console.log(`Axios call: ${method} ${endpoint}`);

        endpoint = endpoint + "/" + this.formatGetData(data);

        let fn = this.getFunctionByHttpMethod(method);

        try {
            let res: any;
            if (method === HttpMethod.GET)
                res = await fn(endpoint + +"/" + this.formatGetData(data));
            else res = await fn(endpoint, data);

            return res.data;
        } catch (err: any) {
            console.error(`Axios error: ${err.message}`);
            if (err.response) {
                // status not in 2xx range
                console.error(`Response error: ${err.response.data.message}`);
            } else if (err.request) {
                console.error(`Request error: no response received`);
            } else {
                console.error(`Unknown error: ${err.message}`);
            }
            throw err;
        }
    };

    private get = (endpoint: string, data: Params): Promise<Result> => {
        return this.baseCall(HttpMethod.GET, endpoint, data);
    };

    private post = (endpoint: string, data: Params): Promise<Result> => {
        return this.baseCall(HttpMethod.POST, endpoint, data);
    };

    private put = (endpoint: string, data: Params): Promise<Result> => {
        return this.baseCall(HttpMethod.PUT, endpoint, data);
    };

    private patch = (endpoint: string, data: Params): Promise<Result> => {
        return this.baseCall(HttpMethod.PATCH, endpoint, data);
    };

    private delete = (endpoint: string, data: Params): Promise<Result> => {
        return this.baseCall(HttpMethod.DELETE, endpoint, data);
    };

    getPhysicians = async (id?: number): Promise<Result & { data: User[] }> => {
        const users = await this.get(this.endpoints.GET_PHYSICIANS, {
            id,
            includeDisabled: false,
        });

        return users.map((user: User) => new User(user));
    };

    login = async (email: string, password: string): Promise<Result> => {
        return this.post("/user/login", { email, password });
    };

    private formatGetData = (data: Params): string => {
        let result = "?";

        Object.entries(data)
            .filter(([_key, value]) => value !== undefined && value !== null)
            .forEach(([key, value]) => {
                result += key + "=" + value + "&";
            });

        return result;
    };

    private getFunctionByHttpMethod = (method: HttpMethod) => {
        switch (method) {
            case HttpMethod.GET:
                return this.controller.get;
            case HttpMethod.POST:
                return this.controller.post;
            case HttpMethod.PUT:
                return this.controller.put;
            case HttpMethod.PATCH:
                return this.controller.patch;
            case HttpMethod.DELETE:
                return this.controller.delete;
        }
    };
}

const instance = new Communication();

export default instance;
