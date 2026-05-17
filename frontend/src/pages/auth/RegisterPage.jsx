import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import { clearAuthError, registerUser } from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useRoleRedirect } from "../../hooks/useRoleRedirect";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      department: "",
      manager: ""
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectTo = useRoleRedirect();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo, user]);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const { data } = await api.get("/auth/managers");
        setManagers(data.managers || []);
      } catch (_error) {
        setManagers([]);
      }
    };

    loadManagers();
  }, []);

  const onSubmit = async (values) => {
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created");
    }
  };

  return (
    <div className="mx-auto max-w-md pt-10">
      <h2 className="text-3xl font-semibold text-white">Create account</h2>
      <p className="mt-2 text-sm text-slate-400">New users join as employees and can be attached to a manager during signup.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Name"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required.",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters."
            }
          })}
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address."
            }
          })}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters."
            },
            validate: (value) =>
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value) ||
              "Password must include upper, lower, and number."
          })}
        />
        <Input
          label="Department"
          error={errors.department?.message}
          {...register("department", {
            required: "Department is required.",
            minLength: {
              value: 2,
              message: "Department must be at least 2 characters."
            }
          })}
        />
        <Select label="Reporting Manager" error={errors.manager?.message} {...register("manager")}>
          <option value="">Choose manager</option>
          {managers.map((manager) => (
            <option key={manager._id} value={manager._id}>
              {manager.name} - {manager.department}
            </option>
          ))}
        </Select>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-400">
        Already have access? <Link className="text-brand-300" to="/login">Sign in</Link>
      </p>
    </div>
  );
}
