import CommunicationController from "./Communication/MainCommunicationController";

export default class AnnotationType {
    id: number;
    name: string;
    annotation_tool: number;
    print_function: string;
    conflict_function: string;
    annotation_interface: string;
    annotation_instructions: string;

    constructor(obj: AnnotationType) {
        this.id = obj.id;
        this.name = obj.name;
        this.annotation_tool = obj.annotation_tool;
        this.print_function = obj.print_function;
        this.conflict_function = obj.conflict_function;
        this.annotation_interface = obj.annotation_interface;
        this.annotation_instructions = obj.annotation_instructions;
    }

    update = async (data: {
        name: string;
        annotation_instructions: string;
        annotation_interface: string;
        print_function: string;
        conflict_function: string;
    }): Promise<boolean> => {
        if (!this.checkDifferences(data)) return false;

        await CommunicationController.updateAnnotationType(this.id, data);

        this.name = data.name;
        this.annotation_instructions = data.annotation_instructions;
        this.annotation_interface = data.annotation_interface;
        this.print_function = data.print_function;
        this.conflict_function = data.conflict_function;

        return true;
    };

    private checkDifferences = (data: {
        name: string;
        annotation_instructions: string;
        annotation_interface: string;
        print_function: string;
        conflict_function: string;
    }) => {
        if (this.name !== data.name) return true;
        if (this.annotation_instructions !== data.annotation_instructions)
            return true;
        if (this.annotation_interface !== data.annotation_interface)
            return true;
        if (this.print_function !== data.print_function) return true;
        if (this.conflict_function !== data.conflict_function) return true;

        return false;
    };
}
