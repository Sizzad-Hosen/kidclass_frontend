"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput, PasswordInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { useLoginMutation } from "@/features/auth/authApi";
import { loginSchema, type LoginFormValues } from "@/features/auth/authSchemas";
import { setCredentials } from "@/features/auth/authSlice";
import { roleRedirectPath } from "@/lib/auth-types";
import { useAppDispatch } from "@/lib/hooks";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success(response.message || "Welcome back to KidClass.");
      router.replace(roleRedirectPath(response.data.user?.role));
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Login failed. Please try again."));
    }
  };

  return (
    <AuthShell
      title="Welcome Back!"
      subtitle="Sign in to continue your journey."
      sideSubtitle="Ready for your next learning quest?"
      tone="blue"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <AuthInput
                    aria-invalid={fieldState.invalid}
                    icon={Mail}
                    placeholder="student@adventure.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-4">
                  <FormLabel>Password</FormLabel>
                  <Link
                    className="text-sm font-semibold text-sky-700 hover:text-sky-800"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    aria-invalid={fieldState.invalid}
                    icon={Lock}
                    placeholder="Your secret key"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="password" />
              </FormItem>
            )}
          />

          <Button
            className="h-14 w-full rounded-full bg-yellow-300 text-lg font-bold text-slate-900 shadow-[0_6px_0_#0369a1] hover:bg-yellow-200"
            disabled={isLoading}
            size="lg"
            type="submit"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            <Rocket />
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-slate-500">
        Don&apos;t have an account?{" "}
        <Link className="font-bold text-sky-700" href="/register">
          Join Now
        </Link>
      </p>
    </AuthShell>
  );
}
