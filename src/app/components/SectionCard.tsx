type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
