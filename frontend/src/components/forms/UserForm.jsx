import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export function UserForm({ user, managers, onSubmit, isSaving }) {
  const {
    register,
    handleSubmit,
    watch
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "employee",
      department: user?.department || "",
      manager: user?.manager?._id || ""
    }
  });

  const selectedRole = watch("role");

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" {...register("name", { required: true })} />
      <Input label="Email" type="email" {...register("email", { required: true })} disabled={Boolean(user)} />
      {!user ? <Input label="Password" type="password" {...register("password", { required: true })} /> : null}
      <Select label="Role" {...register("role")}>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </Select>
      <Input label="Department" {...register("department", { required: true })} />
      {selectedRole === "employee" ? (
        <Select label="Manager" {...register("manager")}>
          <option value="">Choose manager</option>
          {managers.map((manager) => (
            <option key={manager._id} value={manager._id}>
              {manager.name}
            </option>
          ))}
        </Select>
      ) : null}
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
