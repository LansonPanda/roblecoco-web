"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
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

const signupSchema = z.object({
  ownerName: z.string().trim().min(1, "이름을 입력해 주세요."),
  storeName: z.string().trim().min(1, "매장명을 입력해 주세요."),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요.")
    .email("유효한 이메일을 입력해 주세요."),
  phone: z.string().trim().min(1, "전화번호를 입력해 주세요."),
  password: z.string().trim().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function SignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const phonePlaceholder = useMemo(() => "010-1234-5678", []);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      ownerName: "",
      storeName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          owner_name: values.ownerName,
          store_name: values.storeName,
          phone: values.phone,
          email: values.email,
        },
      },
    });

    if (error || !data.user) {
      setSubmitError(error?.message ?? "회원가입에 실패했습니다.");
      return;
    }

    const { error: storeError } = await supabase.from("stores").upsert(
      {
        id: data.user.id,
        name: values.storeName,
        owner_name: values.ownerName,
        phone: values.phone,
        email: values.email,
        status: "pending",
        logo_url: "/roblecoco-logo.png",
      },
      { onConflict: "id" },
    );

    if (storeError) {
      setSubmitError(storeError.message);
      return;
    }

    if (data.session) {
      startTransition(() => {
        router.replace("/store");
        router.refresh();
      });
      return;
    }

    setSubmitSuccess(
      "회원가입이 완료되었습니다. 이메일 인증 후 로그인해 주세요.",
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="owner@roblecoco.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    placeholder={phonePlaceholder}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(formatPhoneNumber(event.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>매장명</FormLabel>
                <FormControl>
                  <Input placeholder="로블코코 본점" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="8자 이상 입력해 주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p
            className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        {submitSuccess ? (
          <p
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            role="status"
          >
            {submitSuccess}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-12 rounded-md px-6"
          disabled={form.formState.isSubmitting || isPending}
        >
          {form.formState.isSubmitting || isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>
    </Form>
  );
}
