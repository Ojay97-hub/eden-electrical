/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Toast } from "@/components/Toast";
import { signOutAction, saveContentAction } from "@/lib/actions";
import type { Section } from "@/lib/content";

type Field = {
  key: string;
  label?: string;
  type: "text" | "textarea" | "image";
  serif?: boolean;
};
type Card = { title: string; help?: string; fields: Field[] };
type SectionKey = "hero" | "about" | "services" | "testimonials" | "contact";

const SCHEMA: Record<
  SectionKey,
  { label: string; summary: string; section: Section | null; cards: Card[] }
> = {
  hero: {
    label: "Hero",
    summary: "Homepage headline, supporting message, primary image and CTAs.",
    section: "hero",
    cards: [
      {
        title: "Headline",
        help: "The large heading shown at the top of the homepage.",
        fields: [{ key: "headline", type: "text", serif: true }],
      },
      {
        title: "Intro paragraph",
        help: "Supporting text beneath the headline.",
        fields: [{ key: "intro", type: "textarea" }],
      },
      {
        title: "Hero image",
        help: "Recommended 1200 x 1040px. JPG or PNG.",
        fields: [{ key: "image", type: "image" }],
      },
      {
        title: "Call-to-action buttons",
        fields: [
          { key: "ctaPrimary", label: "Primary button", type: "text" },
          { key: "ctaSecondary", label: "Secondary button", type: "text" },
        ],
      },
    ],
  },
  about: {
    label: "About",
    summary: "Credentials, positioning and the core story behind Eden.",
    section: "about",
    cards: [
      { title: "Eyebrow label", fields: [{ key: "eyebrow", type: "text" }] },
      {
        title: "Heading",
        fields: [{ key: "heading", type: "text", serif: true }],
      },
      { title: "First paragraph", fields: [{ key: "body1", type: "textarea" }] },
      { title: "Second paragraph", fields: [{ key: "body2", type: "textarea" }] },
    ],
  },
  services: {
    label: "Services",
    summary: "Solar, battery and EV charger cards are currently code-managed.",
    section: null,
    cards: [],
  },
  testimonials: {
    label: "Testimonials",
    summary: "Customer quotes are currently code-managed.",
    section: null,
    cards: [],
  },
  contact: {
    label: "Contact",
    summary: "Public contact details and coverage information.",
    section: "contact",
    cards: [
      { title: "Phone number", fields: [{ key: "phone", type: "text" }] },
      { title: "Email address", fields: [{ key: "email", type: "text" }] },
      { title: "Coverage area", fields: [{ key: "coverage", type: "text" }] },
    ],
  },
};

const NAV: SectionKey[] = ["hero", "about", "services", "testimonials", "contact"];

type Drafts = {
  hero: Record<string, string>;
  about: Record<string, string>;
  contact: Record<string, string>;
};

const inputClass =
  "w-full rounded-[8px] border border-primary/[0.15] bg-field px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted-2 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/[0.15]";

export function AdminEditor({ initial }: { initial: Drafts }) {
  const [active, setActive] = useState<SectionKey>("hero");
  const [drafts, setDrafts] = useState<Drafts>(initial);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const schema = SCHEMA[active];
  const sectionKey = schema.section;
  const draft = sectionKey ? drafts[sectionKey as keyof Drafts] : undefined;
  const isDirty = sectionKey ? !!dirty[sectionKey] : false;
  const editableCount = NAV.filter((key) => SCHEMA[key].section).length;

  function update(key: string, value: string) {
    if (!sectionKey) return;
    setDrafts((d) => ({
      ...d,
      [sectionKey]: { ...d[sectionKey as keyof Drafts], [key]: value },
    }));
    setDirty((d) => ({ ...d, [sectionKey]: true }));
  }

  async function save() {
    if (!sectionKey || !draft) return;
    setSaving(true);
    const res = await saveContentAction(sectionKey, draft);
    setSaving(false);
    if (res.ok) {
      setDirty((d) => ({ ...d, [sectionKey]: false }));
      setToast("Changes saved to the live site.");
    } else {
      setToast(res.error ?? "Could not save changes.");
    }
  }

  function onImage(key: string, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(key, String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#f3efe6] text-ink lg:grid lg:grid-cols-[292px_1fr]">
      <aside className="border-b border-primary/10 bg-primary px-4 py-4 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:px-5 lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <img
            src="/assets/eden-logo-gold.png"
            alt="Eden Electrical"
            width={172}
            height={49}
            className="h-auto w-[148px] lg:w-[172px]"
            style={{ width: 172, height: "auto", maxWidth: "100%" }}
          />
          <div className="flex gap-2 lg:hidden">
            <Link
              href="/"
              className="rounded-[8px] border border-white/[0.12] px-3 py-2 text-[13px] font-semibold text-white/80 no-underline"
            >
              View site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-[8px] border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-[13px] font-semibold text-white/80"
              >
                Log out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-5 hidden rounded-[8px] border border-white/10 bg-white/[0.06] p-4 lg:block">
          <p className="m-0 font-mono text-[11px] uppercase tracking-label text-gold-light/60">
            Website console
          </p>
          <p className="mt-2 text-[14px] leading-6 text-white/[0.74]">
            {editableCount} editable sections wired to the live website.
          </p>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:mt-6 lg:grid-cols-1">
          {NAV.map((key) => {
            const on = active === key;
            const section = SCHEMA[key].section;
            const hasChanges = section ? dirty[section] : false;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`group flex min-h-[54px] items-center gap-3 rounded-[8px] border px-3 py-3 text-left text-[14px] font-semibold transition lg:min-h-[60px] ${
                  on
                    ? "border-gold/[0.45] bg-gold/[0.15] text-gold-light"
                    : "border-white/[0.08] bg-white/[0.03] text-white/[0.68] hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[12px] ${
                    on
                      ? "bg-gold text-primary"
                      : "bg-white/[0.08] text-white/[0.62] group-hover:text-white"
                  }`}
                >
                  {key.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 truncate">{SCHEMA[key].label}</span>
                {hasChanges && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-gold" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto hidden gap-2 pt-6 lg:grid">
          <Link
            href="/"
            className="rounded-[8px] border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-center text-[14px] font-semibold text-white no-underline transition hover:bg-white/[0.1]"
          >
            View live site
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full rounded-[8px] border border-transparent bg-transparent px-4 py-3 text-[14px] font-semibold text-white/55 transition hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-primary/10 bg-[#f3efe6]/[0.92] px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="m-0 font-mono text-[11px] uppercase tracking-label text-gold-ink">
                Content editor
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
                <h1 className="m-0 font-display text-[34px] leading-none text-primary sm:text-[42px]">
                  {schema.label}
                </h1>
                <p className="m-0 max-w-[620px] text-[15px] leading-6 text-muted">
                  {schema.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-[13px] font-semibold ${
                  isDirty
                    ? "border-gold/30 bg-gold/[0.12] text-gold-ink"
                    : "border-[#5da55d]/20 bg-[#5da55d]/10 text-[#3f7c3f]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isDirty ? "bg-gold" : "bg-[#5da55d]"
                  }`}
                />
                {isDirty ? "Unsaved changes" : "Saved"}
              </span>
              <button
                onClick={save}
                disabled={!sectionKey || !isDirty || saving}
                className="rounded-[8px] border border-primary bg-primary px-5 py-3 text-[14px] font-semibold text-gold-light shadow-[0_18px_34px_-26px_rgba(25,55,45,0.9)] transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,820px)_minmax(260px,340px)] lg:px-10 lg:py-8">
          <section className="min-w-0">
            {schema.cards.length === 0 ? (
              <div className="rounded-[12px] border border-primary/10 bg-white p-7 shadow-[0_26px_70px_-58px_rgba(25,55,45,0.8)]">
                <p className="m-0 font-mono text-[11px] uppercase tracking-label text-gold-ink">
                  Not editable yet
                </p>
                <h2 className="mb-3 mt-3 font-display text-[30px] leading-none text-primary">
                  Managed in code for now.
                </h2>
                <p className="m-0 max-w-[620px] text-[15px] leading-7 text-muted">
                  The {schema.label.toLowerCase()} content is not wired to the
                  CMS yet. Hero, About and Contact are ready to edit here.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {schema.cards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-[12px] border border-primary/10 bg-white p-5 shadow-[0_26px_70px_-58px_rgba(25,55,45,0.8)] sm:p-6"
                  >
                    <div className="mb-4 border-b border-primary/[0.08] pb-4">
                      <h2 className="m-0 text-[17px] font-semibold text-primary">
                        {card.title}
                      </h2>
                      {card.help && (
                        <p className="m-0 mt-1 text-[13.5px] leading-6 text-muted">
                          {card.help}
                        </p>
                      )}
                    </div>
                    <div
                      className={
                        card.fields.length > 1
                          ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                          : ""
                      }
                    >
                      {card.fields.map((f) => (
                        <FieldInput
                          key={f.key}
                          field={f}
                          value={draft?.[f.key] ?? ""}
                          onChange={(v) => update(f.key, v)}
                          onImage={(file) => onImage(f.key, file)}
                          inputClass={inputClass}
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-[128px] lg:self-start">
            <div className="rounded-[12px] border border-primary/10 bg-white p-5 shadow-[0_26px_70px_-58px_rgba(25,55,45,0.8)]">
              <p className="m-0 font-mono text-[11px] uppercase tracking-label text-gold-ink">
                Publishing
              </p>
              <h2 className="mb-3 mt-3 text-[18px] font-semibold text-primary">
                Live website updates
              </h2>
              <p className="m-0 text-[14px] leading-6 text-muted">
                Saving publishes this section immediately and refreshes the
                homepage cache.
              </p>
              <div className="mt-5 grid gap-3 border-t border-primary/[0.08] pt-5">
                <StatusRow label="Current section" value={schema.label} />
                <StatusRow
                  label="Edit mode"
                  value={sectionKey ? "Enabled" : "Code-managed"}
                />
                <StatusRow
                  label="State"
                  value={isDirty ? "Needs save" : "Up to date"}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[14px]">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-primary">{value}</span>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  onImage,
  inputClass,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
  onImage: (file: File | undefined) => void;
  inputClass: string;
}) {
  if (field.type === "image") {
    return (
      <div>
        {value && (
          <img
            src={value}
            alt="Hero preview"
            className="mb-3 aspect-[16/10] w-full rounded-[10px] border border-primary/10 object-cover"
          />
        )}
        <label className="block cursor-pointer rounded-[10px] border border-dashed border-primary/25 bg-field p-7 text-center transition hover:border-gold hover:bg-white">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary text-[20px] font-semibold text-gold-light">
            +
          </span>
          <span className="block text-[15px] font-semibold text-primary">
            Upload image
          </span>
          <span className="mt-1 block text-[13px] text-muted">
            PNG or JPG, ideally landscape
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => onImage(e.target.files?.[0])}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="mt-3 rounded-[8px] border border-primary/10 bg-white px-3 py-2 text-[13px] font-semibold text-gold-ink transition hover:border-gold/40"
          >
            Remove image
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {field.label && (
        <label className="mb-2 block text-[13px] font-semibold text-primary">
          {field.label}
        </label>
      )}
      {field.type === "textarea" ? (
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} min-h-[150px] resize-y leading-7`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${
            field.serif ? "font-display text-[18px] text-primary" : ""
          }`}
        />
      )}
    </div>
  );
}
