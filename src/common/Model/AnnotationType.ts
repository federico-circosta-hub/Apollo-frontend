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
}
