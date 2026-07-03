"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/auth-input";
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
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/redux/features/auth/authSchemas";

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await forgotPassword(values).unwrap();
      toast.success(response.message || "Check your inbox for the reset link.");
      form.reset();
    } catch (error) {
      toast.error(
        getAuthErrorMessage(error, "Could not send reset link. Try again."),
      );
    }
  };

  return (
    <AuthShell
      compact
      title="Lost your key?"
      subtitle="Our friendly helper will guide you back to the adventure."
      tone="pink"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Enter your Email</FormLabel>
                <FormControl>
                  <AuthInput
                    aria-invalid={fieldState.invalid}
                    icon={Mail}
                    placeholder="explorer@eduadventure.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="email" />
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
            {isLoading ? "Sending..." : "Send Secret Link"}
          </Button>
        </form>
      </Form>

      <div className="mt-8 border-t pt-6 text-center">
        <Link
          className="inline-flex items-center gap-2 font-bold text-sky-700"
          href="/login"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}
