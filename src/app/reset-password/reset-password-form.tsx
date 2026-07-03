"use client";

import Link from "next/link";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useResetPasswordMutation } from "@/features/auth/authApi";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/authSchemas";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      form.setValue("token", token);
    }
  }, [form, searchParams]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const response = await resetPassword({
        token: values.token,
        password: values.password,
      }).unwrap();
      toast.success(response.message || "Password reset successfully.");
      router.replace("/login");
    } catch (error) {
      toast.error(
        getAuthErrorMessage(error, "Could not reset password. Try again."),
      );
    }
  };

  return (
    <AuthShell
      compact
      title="Reset Password"
      subtitle="Pick something strong and fun!"
      mascot="robot"
      tone="violet"
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="token"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Reset Token</FormLabel>
                <FormControl>
                  <AuthInput
                    aria-invalid={fieldState.invalid}
                    icon={KeyRound}
                    placeholder="Paste token from email"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="token" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    aria-invalid={fieldState.invalid}
                    icon={Lock}
                    placeholder="Type your new secret..."
                    {...field}
                  />
                </FormControl>
                <FormMessage name="password" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    aria-invalid={fieldState.invalid}
                    icon={ShieldCheck}
                    placeholder="One more time!"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="confirmPassword" />
              </FormItem>
            )}
          />

          <Button
            className="h-14 w-full rounded-full bg-sky-700 text-lg font-bold text-white shadow-[0_6px_0_#075985] hover:bg-sky-600"
            disabled={isLoading}
            size="lg"
            type="submit"
          >
            <KeyRound />
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center">
        <Link
          className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-sky-700"
          href="/login"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}
