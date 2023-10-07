import { Dayjs } from "dayjs";
import Task from "../../../common/Model/Task";
import { DetailItemProps } from "../MasterDetail/DetailComponent";
import TaskAssignment from "./TaskAssignment";
import { useContext } from "react";
import { PhysiciansContext } from "../../ViewModel/UsersProvider";

export default function AnnotationTaskDetails({ item }: DetailItemProps) {
    const task = item as Task;
	
	useContext(PhysiciansContext)

    return (
        <>
            <TaskAssignment
                task={task}
                users={[]}
                onAssignmentChange={function (
                    data: {
                        id: number;
                        assign: boolean;
                        deadline: Dayjs | null;
                    }[]
                ): void {}}
            />
        </>
    );
}
