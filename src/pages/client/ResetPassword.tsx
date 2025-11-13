import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import cmsLogo from "@/assets/images/ONBOARDING.png";
import { Loader } from "lucide-react";

import { useResetPasswordWithTokenMutation } from "@/features/auth/authApiSlice";

// Schema for password reset
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordWithTokenMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Token is missing from the URL");
      return;
    }

    try {
      setMessage("");
      await resetPassword({ token, ...data }).unwrap();
      setIsSuccess(true);
      toast.success("Password reset successfully");

      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (error: any) {
      const errMsg =
        error?.data?.error || error?.data?.message || "Something went wrong";
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed right-1/2 top-1/2 z-[100]">
          <Loader className="animate-spin" />
        </div>
      )}

      <section className={`dark:bg-gray-900 ${isLoading && "opacity-50"}`}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full flex justify-center">
            <div className="w-full bg-white rounded-r-lg shadow border dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-center mt-6">
                <img src={cmsLogo} alt="logo" width={150} />
              </div>
              <div className="space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold text-cyan-900 md:text-2xl dark:text-white">
                  Reset your password
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter your new password below.
                </p>
                {message && !isSuccess && (
                  <span className="text-red-500 border rounded-lg bg-red-50 flex px-2 py-3">
                    {message}
                  </span>
                )}

                {isSuccess ? (
                  <div className="text-green-600 text-center font-semibold p-4 border border-green-300 rounded-md bg-green-50">
                    Your password has been reset successfully! Redirecting to sign-in...
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6 w-full"
                    >
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password:</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter new password"
                                className="ring-1"
                                disabled={isLoading}
                                maxLength={30}
                                minLength={8}
                                required
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password:</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm new password"
                                className="ring-1"
                                disabled={isLoading}
                                maxLength={30}
                                minLength={8}
                                required
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-cyan-500 text-white"
                        disabled={isLoading}
                      >
                        Reset Password
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
