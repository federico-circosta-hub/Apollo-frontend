import Task from "../../../common/Model/Task";
import { DetailItemProps } from "../MasterDetail/DetailComponent";
import TaskAssignment from "./TaskAssignment";

export default function AnnotationTaskDetails({ item }: DetailItemProps) {
    const task = item as Task;

    return (
        <>
            <TaskAssignment task={task} />
        </>
    );
}
