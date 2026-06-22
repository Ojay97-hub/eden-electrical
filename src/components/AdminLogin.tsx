/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate, type AuthState } from "@/lib/actions";

const inputClass =
  "box-border w-full rounded-[8px] border border-primary/[0.15] bg-white px-4 py-3.5 text-[15px] text-ink shadow-[inset_0_1px_0_rgba(25,55,45,0.04)] outline-none transition placeholder:text-muted-2 focus:border-gold focus:ring-4 focus:ring-gold/[0.15]";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    undefined
  );

  return (
    <main className="box-border min-h-screen w-full overflow-x-hidden bg-[#f3efe6] text-ink">
      <div className="box-border grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(252,232,147,0.14),transparent_42%),linear-gradient(20deg,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="relative">
            <img
              src="/assets/eden-logo-gold.png"
              alt="Eden Electrical"
              width={190}
              height={54}
              className="h-auto w-[190px]"
              style={{ width: 190, height: "auto", maxWidth: "100%" }}
            />
          </div>

          <div className="relative max-w-[520px] pb-8">
            <p className="mb-4 font-mono text-[12px] uppercase tracking-label text-gold-light/70">
              Private website console
            </p>
            <h1 className="m-0 font-display text-[52px] leading-[0.95] tracking-normal text-gold-light">
              Keep the Eden site current.
            </h1>
            <p className="mt-6 max-w-[440px] text-[17px] leading-8 text-white/72">
              Update hero copy, about content, imagery and contact details from
              a focused editor built for quick, confident changes.
            </p>
            <div className="mt-9 grid grid-cols-3 gap-3">
              {["Hero", "About", "Contact"].map((item) => (
                <div
                  key={item}
                  className="rounded-[8px] border border-white/[0.12] bg-white/[0.07] px-4 py-3"
                >
                  <div className="text-[13px] font-semibold text-white">
                    {item}
                  </div>
                  <div className="mt-1 h-1.5 w-10 rounded-full bg-gold" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="box-border flex min-h-screen w-full min-w-0 items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
          <div className="w-full min-w-0 max-w-full sm:max-w-[460px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <img
                src="/assets/eden-logo-gold.png"
                alt="Eden Electrical"
                width={152}
                height={43}
                className="h-auto w-[152px]"
                style={{ width: 152, height: "auto", maxWidth: "100%" }}
              />
              <Link
                href="/"
                className="rounded-[8px] border border-primary/10 bg-white px-3 py-2 text-[13px] font-semibold text-primary no-underline shadow-sm transition hover:border-primary/20"
              >
                View site
              </Link>
            </div>

            <div className="mb-7">
              <p className="mb-3 font-mono text-[12px] uppercase tracking-label text-gold-ink">
                Admin access
              </p>
              <h2 className="m-0 font-display text-[36px] leading-none text-primary sm:text-[46px]">
                Welcome back.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-muted">
                Sign in to manage the content that appears on the public
                website.
              </p>
            </div>

            <form
              action={formAction}
              className="box-border w-full rounded-[12px] border border-primary/10 bg-white p-6 shadow-[0_28px_70px_-48px_rgba(25,55,45,0.8)] sm:p-8"
            >
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-primary">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@edenelectrical.co.uk"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-primary">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-body">
                  <input
                    type="checkbox"
                    name="remember"
                    defaultChecked
                    className="h-4 w-4 accent-primary"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-[14px] font-semibold text-gold-ink no-underline transition hover:text-primary"
                >
                  Forgot password?
                </a>
              </div>

              {state?.error && (
                <p
                  className="mt-5 rounded-[8px] border border-[#a23b2d]/20 bg-[#a23b2d]/5 px-4 py-3 text-[14px] text-[#8b2f24]"
                  role="alert"
                >
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-7 w-full rounded-[8px] border border-primary bg-primary p-4 text-[15px] font-semibold text-gold-light shadow-[0_18px_34px_-24px_rgba(25,55,45,0.9)] transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 hidden text-center lg:block">
              <Link
                href="/"
                className="text-[14px] font-semibold text-muted no-underline transition hover:text-primary"
              >
                Back to website
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
