import AnnotationType from "./AnnotationType";
import CommunicationController from "./CommunicationController";

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
    private annotationTypes: AnnotationType[] = [];

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

    filter = (filter: string): boolean => {
        return this.name.toLowerCase().includes(filter.toLowerCase());
    };

    types = async (): Promise<AnnotationType[]> => {
        if (this.annotationTypes.length === 0) {
            this.annotationTypes =
                await CommunicationController.getAnnotationTypes(this.id);
        }
        return this.annotationTypes;
    };
}
