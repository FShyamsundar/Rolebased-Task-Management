import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useRoleRedirect } from "../../hooks/useRoleRedirect";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const redirectTo = useRoleRedirect();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back");
    }
  };

  return (
    <div className="mx-auto max-w-md pt-10">
      <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
      <p className="mt-2 text-sm text-slate-500">Use your role-based account to access the dashboard.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-600">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters."
                }
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-sm text-rose-500">{errors.password.message}</p> : null}
        </label>
        <div className="flex items-center justify-between text-sm">
          <Link className="text-brand-300" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-slate-500" to="/register">
            Create account
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-slate-700">
        Demo users are available after seeding:
        <div className="mt-2 space-y-1 text-xs text-slate-500">
          <p>`admin@taskflowhq.com / Admin@123`</p>
          <p>`manager@taskflowhq.com / Manager@123`</p>
          <p>`riya@taskflowhq.com / Employee@123`</p>
        </div>
      </div>
    </div>
  );
}
