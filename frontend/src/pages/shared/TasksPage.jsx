import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Search, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, deleteTask, fetchTasks, updateTask } from "../../features/tasks/taskSlice";
import { fetchUsers } from "../../features/users/userSlice";
import { setTaskView } from "../../features/ui/uiSlice";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { KanbanBoard } from "../../components/dashboard/KanbanBoard";
import { TaskTable } from "../../components/tables/TaskTable";
import { ModalShell } from "../../components/modals/ModalShell";
import { TaskForm } from "../../components/forms/TaskForm";

export default function TasksPage() {
  const dispatch = useDispatch();
  const { tasks, isLoading, isSaving } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { taskView } = useSelector((state) => state.ui);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const isEmployee = user?.role === "employee";
  const canManageTasks = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    dispatch(fetchTasks());
    if (canManageTasks) {
      dispatch(fetchUsers({ role: "employee", limit: 100 }));
    }
  }, [canManageTasks, dispatch]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        [task.title, task.description, task.assignedTo?.name, task.assignedBy?.name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, tasks]
  );

  const taskSummary = useMemo(() => {
    const completed = filteredTasks.filter((task) => task.status === "completed").length;
    const inProgress = filteredTasks.filter((task) => task.status === "in-progress").length;
    const overdue = filteredTasks.filter((task) => task.status === "overdue").length;

    return [
      {
        label: isEmployee ? "My Tasks" : "Team Tasks",
        value: filteredTasks.length,
        helper: isEmployee ? "Assigned directly to you" : "Visible across your workspace"
      },
      { label: "Completed", value: completed, helper: "Delivered work" },
      { label: "In Progress", value: inProgress, helper: "Currently moving" },
      { label: "Overdue", value: overdue, helper: "Needs follow-up" }
    ];
  }, [filteredTasks, isEmployee]);

  const handleSave = async (values) => {
    const action = selectedTask
      ? updateTask({ id: selectedTask._id, payload: values })
      : createTask(values);
    const result = await dispatch(action);

    if (createTask.fulfilled.match(result) || updateTask.fulfilled.match(result)) {
      toast.success(selectedTask ? "Task updated" : "Task created");
      setModalOpen(false);
      setSelectedTask(null);
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  const handleComplete = async (task) => {
    const result = await dispatch(updateTask({ id: task._id, payload: { status: "completed" } }));

    if (updateTask.fulfilled.match(result)) {
      toast.success("Task marked as completed");
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      toast.success("Task deleted");
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskSummary.map((item) => (
          <Card key={item.label} className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-accent-500 to-brand-500" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks"
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => dispatch(setTaskView(taskView === "kanban" ? "table" : "kanban"))}>
            {taskView === "kanban" ? "Table View" : "Kanban View"}
          </Button>
          {canManageTasks ? (
            <Button
              onClick={() => {
                setSelectedTask(null);
                setModalOpen(true);
              }}
            >
              New Task
            </Button>
          ) : null}
        </div>
      </Card>

      {isLoading ? (
        <Card className="h-72 animate-pulse" />
      ) : filteredTasks.length ? (
        taskView === "kanban" ? (
          <KanbanBoard
            tasks={filteredTasks}
            onSelect={
              canManageTasks
                ? (task) => {
                    setSelectedTask(task);
                    setModalOpen(true);
                  }
                : undefined
            }
            renderTaskAction={
              isEmployee
                ? (task) =>
                    task.status !== "completed" ? (
                      <Button className="w-full" onClick={() => handleComplete(task)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Completed
                      </Button>
                    ) : (
                      <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-600">
                        Completed
                      </div>
                    )
                : undefined
            }
          />
        ) : (
          <Card>
            <TaskTable
              tasks={filteredTasks}
              onEdit={(task) => {
                setSelectedTask(task);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              canDelete={canManageTasks}
              canEdit={canManageTasks}
              editLabel={isEmployee ? "View" : "Edit"}
              renderRowAction={
                isEmployee
                  ? (task) =>
                      task.status !== "completed" ? (
                        <Button className="px-3 py-2 text-xs" onClick={() => handleComplete(task)}>
                          Complete
                        </Button>
                      ) : null
                  : undefined
              }
            />
          </Card>
        )
      ) : (
        <EmptyState
          title="No tasks found"
          description={
            isEmployee
              ? "You do not have any assigned tasks yet."
              : "Create a task or adjust your search and filters."
          }
        />
      )}

      {canManageTasks ? (
        <ModalShell
          open={isModalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTask(null);
          }}
          title={selectedTask ? "Edit Task" : "Create Task"}
        >
          <TaskForm
            task={selectedTask}
            employees={users.filter((member) => member.role === "employee")}
            onSubmit={handleSave}
            isSaving={isSaving}
            canAssign={canManageTasks}
          />
        </ModalShell>
      ) : null}
    </div>
  );
}
