import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, BriefcaseBusiness, Plus, Users2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, deleteUser, fetchUsers, updateUser } from "../../features/users/userSlice";
import { fetchTasks } from "../../features/tasks/taskSlice";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Badge } from "../../components/ui/Badge";
import { UserTable } from "../../components/tables/UserTable";
import { ModalShell } from "../../components/modals/ModalShell";
import { UserForm } from "../../components/forms/UserForm";
import { formatDate, getInitials, getPriorityColor, getStatusColor } from "../../utils/helpers";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const { tasks } = useSelector((state) => state.tasks);
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
    dispatch(fetchTasks());
  }, [dispatch]);

  const managers = useMemo(() => users.filter((user) => user.role === "manager"), [users]);
  const canManageUsers = currentUser?.role === "admin";

  const visibleManagers = useMemo(() => {
    if (canManageUsers) {
      return managers;
    }

    return managers.filter((manager) => manager._id === currentUser?._id);
  }, [canManageUsers, currentUser?._id, managers]);

  const selectedManager = useMemo(
    () => visibleManagers.find((manager) => manager._id === selectedManagerId) || visibleManagers[0] || null,
    [selectedManagerId, visibleManagers]
  );

  const managerEmployees = useMemo(() => {
    if (!selectedManager) {
      return [];
    }

    return users.filter(
      (user) => user.role === "employee" && user.manager?._id === selectedManager._id
    );
  }, [selectedManager, users]);

  const selectedEmployee = useMemo(
    () => managerEmployees.find((employee) => employee._id === selectedEmployeeId) || managerEmployees[0] || null,
    [managerEmployees, selectedEmployeeId]
  );

  const selectedEmployeeTasks = useMemo(() => {
    if (!selectedEmployee) {
      return [];
    }

    return tasks.filter((task) => task.assignedTo?._id === selectedEmployee._id);
  }, [selectedEmployee, tasks]);

  useEffect(() => {
    if (!selectedManagerId && visibleManagers[0]) {
      setSelectedManagerId(visibleManagers[0]._id);
    }
  }, [selectedManagerId, visibleManagers]);

  useEffect(() => {
    if (!selectedEmployeeId && managerEmployees[0]) {
      setSelectedEmployeeId(managerEmployees[0]._id);
    }
  }, [managerEmployees, selectedEmployeeId]);

  useEffect(() => {
    if (selectedManager && !managerEmployees.some((employee) => employee._id === selectedEmployeeId)) {
      setSelectedEmployeeId(managerEmployees[0]?._id || "");
    }
  }, [managerEmployees, selectedEmployeeId, selectedManager]);

  const handleSave = async (values) => {
    const action = selectedUser
      ? updateUser({ id: selectedUser._id, payload: values })
      : createUser(values);
    const result = await dispatch(action);
    if (
      createUser.fulfilled.match(result) ||
      updateUser.fulfilled.match(result)
    ) {
      toast.success(selectedUser ? "User updated" : "User created");
      setModalOpen(false);
      setSelectedUser(null);
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(result)) {
      toast.success("User deleted");
    }
  };

  const groupedRoster = canManageUsers
    ? users
    : users.filter((user) => user.role === "employee" || user._id === currentUser?._id);

  return (
    <div className="space-y-6">
      <Card className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {canManageUsers ? "People Directory" : "Team Directory"}
          </h3>
          <p className="text-sm text-slate-500">
            {canManageUsers
              ? "Manage managers, employees, and reporting lines from one place."
              : "Review your team members and the tasks assigned to them."}
          </p>
        </div>
        {canManageUsers ? (
          <Button
            onClick={() => {
              setSelectedUser(null);
              setModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        ) : null}
      </Card>

      {visibleManagers.length ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {canManageUsers ? "Managers" : "Your Team"}
                </h3>
                <p className="text-sm text-slate-500">
                  Select a manager to inspect their employees and assigned work.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {visibleManagers.map((manager) => {
                const teamMembers = users.filter(
                  (user) => user.role === "employee" && user.manager?._id === manager._id
                );
                const taskCount = tasks.filter((task) =>
                  teamMembers.some((member) => member._id === task.assignedTo?._id)
                ).length;

                return (
                  <button
                    key={manager._id}
                    className={`rounded-3xl border p-4 text-left transition ${
                      selectedManager?._id === manager._id
                        ? "border-brand-300 bg-gradient-to-r from-brand-50 to-accent-100/70 shadow-lg shadow-orange-100"
                        : "border-brand-100 bg-white/75 hover:-translate-y-0.5 hover:border-brand-200"
                    }`}
                    onClick={() => setSelectedManagerId(manager._id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-sm font-semibold text-white">
                          {getInitials(manager.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{manager.name}</p>
                          <p className="text-sm text-slate-500">{manager.email}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Badge className="bg-brand-50 text-brand-600">{teamMembers.length} employees</Badge>
                      <Badge className="bg-amber-50 text-amber-700">{taskCount} tasks</Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-6">
            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                  <Users2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedManager ? `${selectedManager.name}'s team` : "Team members"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Click an employee to see the tasks currently assigned to them.
                  </p>
                </div>
              </div>

              {managerEmployees.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {managerEmployees.map((employee) => {
                    const employeeTaskCount = tasks.filter(
                      (task) => task.assignedTo?._id === employee._id
                    ).length;

                    return (
                      <button
                        key={employee._id}
                        className={`rounded-3xl border p-4 text-left transition ${
                          selectedEmployee?._id === employee._id
                            ? "border-brand-300 bg-brand-50 shadow-md shadow-orange-100"
                            : "border-brand-100 bg-white hover:-translate-y-0.5 hover:border-brand-200"
                        }`}
                        onClick={() => setSelectedEmployeeId(employee._id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                            {getInitials(employee.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{employee.name}</p>
                            <p className="text-sm text-slate-500">{employee.department}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Badge className="bg-brand-50 text-brand-600">{employeeTaskCount} tasks</Badge>
                          <Badge className="bg-emerald-50 text-emerald-700">
                            {employee.isActive ? "active" : "inactive"}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No employees assigned"
                  description="Assign employees to this manager to view their workload here."
                />
              )}
            </Card>

            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedEmployee ? `${selectedEmployee.name}'s tasks` : "Assigned tasks"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Admins can inspect every team. Managers can monitor just their own team.
                  </p>
                </div>
              </div>

              {selectedEmployeeTasks.length ? (
                <div className="space-y-3">
                  {selectedEmployeeTasks.map((task) => (
                    <div key={task._id} className="rounded-3xl border border-brand-100 bg-white p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{task.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                            Due {formatDate(task.dueDate)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks for this employee"
                  description="Once tasks are assigned, they will appear in this panel."
                />
              )}
            </Card>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <Card className="h-64 animate-pulse" />
      ) : groupedRoster.length ? (
        <Card>
          <UserTable
            users={groupedRoster}
            onEdit={(user) => {
              setSelectedUser(user);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
            canDelete={canManageUsers}
            canEdit={canManageUsers}
          />
        </Card>
      ) : (
        <EmptyState title="No users found" description="Create your first manager or employee." />
      )}

      <ModalShell
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Edit User" : "Add User"}
      >
        <UserForm user={selectedUser} managers={managers} onSubmit={handleSave} />
      </ModalShell>
    </div>
  );
}
