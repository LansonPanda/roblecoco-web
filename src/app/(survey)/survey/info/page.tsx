import { CustomerInfoForm } from "@/components/survey/customer-info-form";

export default function SurveyInfoPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <section className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <CustomerInfoForm />
      </section>
    </main>
  );
}
