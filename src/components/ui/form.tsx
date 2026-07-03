"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative", className)} {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function FormMessage({
  className,
  name,
  ...props
}: React.ComponentProps<"p"> & { name?: string }) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = name ? errors[name] : undefined;
  const body = error?.message ? String(error.message) : props.children;

  if (!body) {
    return null;
  }

  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
