import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

  return (
    <div className="mx-auto max-w-md pt-10">
      <h2 className="text-3xl font-semibold text-slate-900">Forgot password</h2>
      <p className="mt-2 text-sm text-slate-500">
        This UI is deployment-ready and can be connected to your email workflow later.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={handleSubmit(() => toast.success("Reset instructions UI triggered."))}
      >
        <Input label="Work Email" type="email" {...register("email", { required: true })} />
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>
    </div>
  );
}
