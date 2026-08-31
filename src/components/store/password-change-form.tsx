"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updatePasswordAction } from "@/app/(store)/store/settings/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().trim().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type PasswordChangeValues = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (values: PasswordChangeValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await updatePasswordAction({ password: values.password });

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    startTransition(() => {
      setSubmitSuccess(result.message ?? "비밀번호가 변경되었습니다.");
      form.reset({ password: "" });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}

        {submitSuccess ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {submitSuccess}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-11 rounded-md px-6"
          disabled={isPending || form.formState.isSubmitting}
        >
          {isPending || form.formState.isSubmitting
            ? "변경 중..."
            : "비밀번호 변경"}
        </Button>
      </form>
    </Form>
  );
}
