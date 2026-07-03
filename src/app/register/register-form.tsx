"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Lock, Mail, Rocket, User } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { useRegisterMutation } from "@/features/auth/authApi";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/authSchemas";
import { setCredentials } from "@/features/auth/authSlice";
import { roleRedirectPath } from "@/lib/auth-types";
import { useAppDispatch } from "@/lib/hooks";

const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      classLevel: "Class 1",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await registerUser(values).unwrap();
      dispatch(setCredentials(response.data));
      toast.success(response.message || "Your KidClass profile is ready.");
      router.replace(roleRedirectPath(response.data.user?.role));
    } catch (error) {
      toast.error(
        getAuthErrorMessage(error, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <AuthShell
      title="Join the Adventure"
      subtitle="Create your learning profile today!"
      sideTitle="Welcome, Explorer!"
      sideSubtitle="Join thousands of friends in a world where learning is the greatest adventure of all."
      tone="mint"
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <AuthInput
                    aria-invalid={fieldState.invalid}
                    icon={User}
                    placeholder="Enter name"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="name" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Parent&apos;s Email</FormLabel>
                <FormControl>
                  <AuthInput
                    aria-invalid={fieldState.invalid}
                    icon={Mail}
                    placeholder="email@parent.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage name="email" />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      aria-invalid={fieldState.invalid}
                      icon={Lock}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage name="password" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classLevel"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Choose Class</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="h-14 w-full rounded-full border-2 border-slate-200 bg-slate-100/80 px-5 text-base shadow-inner focus-visible:border-sky-400 focus-visible:ring-sky-200"
                      >
                        <GraduationCap className="size-5 text-slate-500" />
                        <SelectValue placeholder="Class 1" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage name="classLevel" />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="h-14 w-full rounded-full bg-yellow-300 text-lg font-bold text-slate-900 shadow-[0_6px_0_#0369a1] hover:bg-yellow-200"
            disabled={isLoading}
            size="lg"
            type="submit"
          >
            {isLoading ? "Creating profile..." : "Join the Adventure"}
            <Rocket />
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-slate-500">
        Already have an account?{" "}
        <Link className="font-bold text-sky-700" href="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
