"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { updateStoreSettingsAction } from "@/app/(store)/store/settings/actions";
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

const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(1, "매장명을 입력해 주세요."),
  ownerName: z.string().trim().min(1, "이름을 입력해 주세요."),
  phone: z.string().trim().min(1, "전화번호를 입력해 주세요."),
});

export type UpdateStoreSettingsValues = z.infer<typeof storeSettingsSchema>;

type StoreSettingsFormProps = {
  defaultValues: UpdateStoreSettingsValues & {
    logoUrl: string;
  };
};

const logoBucketName = "store-logos";
const defaultLogoUrl = "/roblecoco-logo.png";

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

export function StoreSettingsForm({ defaultValues }: StoreSettingsFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(
    defaultValues.logoUrl || defaultLogoUrl,
  );
  const [isPending, startTransition] = useTransition();
  const previousObjectUrlRef = useRef<string | null>(null);

  const normalizedDefaultValues = useMemo(
    () => ({
      ...defaultValues,
      phone: formatPhoneNumber(defaultValues.phone),
    }),
    [defaultValues],
  );

  const form = useForm<UpdateStoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: normalizedDefaultValues,
  });

  useEffect(() => {
    return () => {
      if (previousObjectUrlRef.current) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }
    };
  }, []);

  const phonePlaceholder = useMemo(() => "010-1234-5678", []);

  const handleLogoFileChange = (file: File | null) => {
    if (previousObjectUrlRef.current) {
      URL.revokeObjectURL(previousObjectUrlRef.current);
      previousObjectUrlRef.current = null;
    }

    setSelectedLogoFile(file);
    if (file) {
      const nextObjectUrl = URL.createObjectURL(file);
      previousObjectUrlRef.current = nextObjectUrl;
      setLogoPreviewUrl(nextObjectUrl);
      return;
    }

    setLogoPreviewUrl(defaultValues.logoUrl || defaultLogoUrl);
  };

  const uploadLogoFile = async () => {
    if (!selectedLogoFile) {
      return defaultValues.logoUrl || defaultLogoUrl;
    }

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      throw new Error("로그인 세션을 확인할 수 없습니다.");
    }

    const fileName = selectedLogoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${selectedLogoFile.lastModified}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(logoBucketName)
      .upload(filePath, selectedLogoFile, {
        upsert: true,
        contentType: selectedLogoFile.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from(logoBucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (values: UpdateStoreSettingsValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    let logoUrl = defaultValues.logoUrl || defaultLogoUrl;

    try {
      logoUrl = await uploadLogoFile();
      setLogoPreviewUrl(logoUrl);
      setSelectedLogoFile(null);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "로고 업로드에 실패했습니다.",
      );
      return;
    }

    const result = await updateStoreSettingsAction({
      ...values,
      phone: formatPhoneNumber(values.phone),
      logoUrl,
    });

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    startTransition(() => {
      setSubmitSuccess(result.message ?? "매장 정보가 저장되었습니다.");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-4">
            <Image
              src={logoPreviewUrl}
              alt="현재 로고 미리보기"
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 shrink-0 rounded-2xl border border-zinc-200 bg-white object-cover"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900">로고 미리보기</p>
              <p className="text-xs leading-5 text-zinc-500">
                기본 로고는 /roblecoco-logo.png 입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-700">
            로고 파일 업로드
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => {
              handleLogoFileChange(event.target.files?.[0] ?? null);
            }}
          />
          <p className="text-xs text-zinc-500">
            PNG, JPG, WEBP 이미지를 업로드할 수 있습니다.
          </p>
        </div>

        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>매장명</FormLabel>
              <FormControl>
                <Input placeholder="매장명" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="이름" {...field} />
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
        </div>

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
          {isPending || form.formState.isSubmitting ? "저장 중..." : "저장"}
        </Button>
      </form>
    </Form>
  );
}
