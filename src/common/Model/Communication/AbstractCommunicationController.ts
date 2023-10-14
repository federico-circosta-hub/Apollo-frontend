import axios, { AxiosInstance } from "axios";

type Params = { [key: string]: any };
type Result = any;

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
}

abstract class AbstractCommunicationController {
    private controller: AxiosInstance;

    constructor(url: string) {
        this.controller = axios.create({
            baseURL: url,
            timeout: 10000,
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
    }

    signalController?: AbortController;

    protected getHeaders(): { [key: string]: string } {
        return {};
    }

    private baseCall = async (
        method: HttpMethod,
        endpoint: string,
        data: Params
    ): Promise<Result> => {
        console.log(`Axios call: ${method} ${endpoint}`);

        this.signalController = new AbortController();
        const config = {
            headers: this.getHeaders(),
            signal: this.signalController.signal,
        };

        let fn = this.getFunctionByHttpMethod(method);

        try {
            let res: any;
            if (method === HttpMethod.GET)
                res = await fn(
                    endpoint + "/" + this.formatGetData(data),
                    config
                );
            else if (method === HttpMethod.DELETE)
                res = await fn(endpoint, { ...config, data: data });
            else res = await fn(endpoint, data, config);

            return res.data;
        } catch (err: any) {
            console.error(`Axios error: ${err.message}`);
            if (err.response) {
                // status not in 2xx range
                console.error(`Response error: ${err.response.data.message}`);
            } else if (err.request) {
                console.error(`Request error: no response received`);
            }
            throw err;
        }
    };

    get = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.GET, endpoint, data);
    };

    post = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.POST, endpoint, data);
    };

    put = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.PUT, endpoint, data);
    };

    patch = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.PATCH, endpoint, data);
    };

    delete = (endpoint: string, data: Params = {}): Promise<Result> => {
        return this.baseCall(HttpMethod.DELETE, endpoint, data);
    };

    abortLast = () => {
        this.signalController?.abort();
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

export default AbstractCommunicationController;
