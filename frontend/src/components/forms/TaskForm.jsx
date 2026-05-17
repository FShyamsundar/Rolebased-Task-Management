import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function TaskForm({ task, employees, onSubmit, isSaving, canAssign = true }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      status: task?.status || "pending",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
      assignedTo: task?.assignedTo?._id || "",
      comment: ""
    }
  });

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:col-span-2">
        <Input label="Title" error={errors.title?.message} {...register("title", { required: "Title is required" })} />
      </div>
      <div className="md:col-span-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-600">Description</span>
          <textarea
            rows="4"
            className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description ? <p className="text-sm text-rose-500">{errors.description.message}</p> : null}
        </label>
      </div>
      <Select label="Priority" {...register("priority")}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </Select>
      <Select label="Status" {...register("status")}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </Select>
      <Input label="Due Date" type="date" {...register("dueDate", { required: "Due date is required" })} />
      {canAssign ? (
        <Select label="Assign To" {...register("assignedTo", { required: "Select an employee" })}>
          <option value="">Choose employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </Select>
      ) : null}
      <div className="md:col-span-2">
        <Input
          label={task ? "Feedback / Comment" : "Comment"}
          placeholder={task ? "Add feedback for the employee or note the reassignment" : "Add context for the assignee"}
          {...register("comment")}
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
