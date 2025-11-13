import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

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


import { useForgotPasswordMutation } from "@/features/auth/authApiSlice";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation(); // ✅ API Hook

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setMessage("");
    try {
      await forgotPassword(data).unwrap(); // ✅ actual API call
      setIsSuccess(true);
      setMessage("Reset link sent to your email. Please check your email.");
      toast.success("Reset link sent to your email");
    } catch (error: any) {
      const errMsg =
        error?.data?.error || error?.data?.message || "Something went wrong";
      setMessage(errMsg);
      setIsSuccess(false);
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
                  Forgot your password?
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter your email address and we’ll send you a link to reset your password.
                </p>
                {(isSuccess && message !== "") ? (
                  <span className="text-green-500 border rounded-lg bg-green-50 flex px-2 py-3">
                    {message}
                  </span>
                ) : (
                  message && (
                    <span className="text-red-500 border rounded-lg bg-red-50 flex px-2 py-3">
                      {message}
                    </span>
                  )
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address:</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="ring-1"
                              disabled={isLoading}
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
                      Send Reset Link
                    </Button>

                    <div className="text-sm text-center text-gray-600 dark:text-gray-300">
                      <a
                        href="/sign-in"
                        className="text-cyan-500 hover:underline dark:text-cyan-400"
                      >
                        Back to Sign In
                      </a>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
