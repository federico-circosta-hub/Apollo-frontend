import AnnotationType from "./AnnotationType";
import CommunicationController from "./CommunicationController";

export type AnnotationToolEndpoints = {
    add_storage_endpoint: string;
    add_webhook_endpoint: string;
    create_task_endpoint: string;
    delete_task_endpoint: string;
    edit_annotation_endpoint: string;
    import_media_endpoint: string;
    task_homepage_endpoint: string;
    update_annotation_endpoint: string;
};

export type EndpointsKey = keyof AnnotationToolEndpoints;

export const isEndpointValid = (endpoint: string) => {
    return endpoint.trim() !== "";
};

export const isAnnotationToolDataValid = (data: AnnotationToolData) => {
    const ok = data.name.trim() !== "" && data.base_url.trim() !== "";
    if (!ok) return false;

    for (const key in data.endpoints)
        if (!isEndpointValid(data.endpoints[key as EndpointsKey])) return false;

    return true;
};

export class AnnotationToolData {
    name: string = "";
    base_url: string = "";
    authorization_header: string = "";
    new_instance_instructions: string = "";
    endpoints: AnnotationToolEndpoints = {
        create_task_endpoint: "",
        delete_task_endpoint: "",
        task_homepage_endpoint: "",
        import_media_endpoint: "",
        add_storage_endpoint: "",
        add_webhook_endpoint: "",
        update_annotation_endpoint: "",
        edit_annotation_endpoint: "",
    };
}

export type AnnotationToolDataKey = keyof AnnotationToolData;

export default class AnnotationTool {
    id: number;
    name: string;
    base_url: string;
    authorization_header: string;
    new_instance_instructions: string;

    create_task_endpoint: string;
    delete_task_endpoint: string;
    task_homepage_endpoint: string;
    import_media_endpoint: string;
    add_storage_endpoint: string;
    add_webhook_endpoint: string;
    update_annotation_endpoint: string;
    edit_annotation_endpoint: string;

    annotationTypes: AnnotationType[] = [];
    private _typesSynchronized: boolean = false;

    constructor(obj: AnnotationTool) {
        this.id = obj.id;
        this.name = obj.name;
        this.base_url = obj.base_url;
        this.authorization_header = obj.authorization_header;
        this.new_instance_instructions = obj.new_instance_instructions;
        this.create_task_endpoint = obj.create_task_endpoint;
        this.delete_task_endpoint = obj.delete_task_endpoint;
        this.task_homepage_endpoint = obj.task_homepage_endpoint;
        this.import_media_endpoint = obj.import_media_endpoint;
        this.add_storage_endpoint = obj.add_storage_endpoint;
        this.add_webhook_endpoint = obj.add_webhook_endpoint;
        this.update_annotation_endpoint = obj.update_annotation_endpoint;
        this.edit_annotation_endpoint = obj.edit_annotation_endpoint;
    }

    getData = (): AnnotationToolData => {
        return {
            name: this.name,
            base_url: this.base_url,
            authorization_header: this.authorization_header,
            new_instance_instructions: this.new_instance_instructions,
            endpoints: {
                create_task_endpoint: this.create_task_endpoint,
                delete_task_endpoint: this.delete_task_endpoint,
                task_homepage_endpoint: this.task_homepage_endpoint,
                import_media_endpoint: this.import_media_endpoint,
                add_storage_endpoint: this.add_storage_endpoint,
                add_webhook_endpoint: this.add_webhook_endpoint,
                update_annotation_endpoint: this.update_annotation_endpoint,
                edit_annotation_endpoint: this.edit_annotation_endpoint,
            },
        };
    };

    filter = (filter: string): boolean => {
        return this.name.toLowerCase().includes(filter.toLowerCase());
    };

    fetchTypes = async (): Promise<AnnotationType[]> => {
        if (!this._typesSynchronized) {
            this.annotationTypes =
                await CommunicationController.getAnnotationTypes(this.id);
            this._typesSynchronized = true;
        }
        return this.annotationTypes;
    };

    addType = async (data: {
        name: string;
        annotation_instructions: string;
        annotation_interface: string;
        print_function: string;
        conflict_function: string;
    }): Promise<AnnotationType> => {
        const newType = await CommunicationController.newAnnotationType(
            this.id,
            data
        );
        this.annotationTypes.push(newType);
        return newType;
    };

    async deleteType(type: AnnotationType) {
        await CommunicationController.deleteAnnotationType(type.id);
        this.annotationTypes = this.annotationTypes.filter(
            (t) => t.id !== type.id
        );
    }

    update = async (data: AnnotationToolData): Promise<boolean> => {
        if (!isAnnotationToolDataValid(data) || !this.checkDifferences(data))
            return false;

        await CommunicationController.updateAnnotationTool(this.id, data);

        this.base_url = data.base_url;
        this.authorization_header = data.authorization_header;
        this.new_instance_instructions = data.new_instance_instructions;

        this.create_task_endpoint = data.endpoints.create_task_endpoint;
        this.delete_task_endpoint = data.endpoints.delete_task_endpoint;
        this.task_homepage_endpoint = data.endpoints.task_homepage_endpoint;
        this.import_media_endpoint = data.endpoints.import_media_endpoint;
        this.add_storage_endpoint = data.endpoints.add_storage_endpoint;
        this.add_webhook_endpoint = data.endpoints.add_webhook_endpoint;
        this.update_annotation_endpoint =
            data.endpoints.update_annotation_endpoint;
        this.edit_annotation_endpoint = data.endpoints.edit_annotation_endpoint;
        return true;
    };

    private checkDifferences = (data: AnnotationToolData) => {
        if (this.base_url !== data.base_url) return true;
        if (this.authorization_header !== data.authorization_header)
            return true;
        if (this.new_instance_instructions !== data.new_instance_instructions)
            return true;

        if (this.create_task_endpoint !== data.endpoints.create_task_endpoint)
            return true;
        if (this.delete_task_endpoint !== data.endpoints.delete_task_endpoint)
            return true;
        if (
            this.task_homepage_endpoint !==
            data.endpoints.task_homepage_endpoint
        )
            return true;
        if (this.import_media_endpoint !== data.endpoints.import_media_endpoint)
            return true;
        if (this.add_storage_endpoint !== data.endpoints.add_storage_endpoint)
            return true;
        if (this.add_webhook_endpoint !== data.endpoints.add_webhook_endpoint)
            return true;
        if (
            this.update_annotation_endpoint !==
            data.endpoints.update_annotation_endpoint
        )
            return true;
        if (
            this.edit_annotation_endpoint !==
            data.endpoints.edit_annotation_endpoint
        )
            return true;

        return false;
    };
}
