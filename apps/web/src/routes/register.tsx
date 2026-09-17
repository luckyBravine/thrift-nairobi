import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Create an Account — Thift Nairobi" },
    { name: "description", content: "Create a Thift Nairobi account to save pieces and follow your orders." },
    { property: "og:title", content: "Create an Account — Thift Nairobi" },
    { property: "og:description", content: "Save pieces, track orders and shop new drops first." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Register,
});

function Register() {
  const [done, setDone] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setDone(true); }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">Optional account</p>
      <h1 className="mt-3 font-display text-5xl">Join the rail.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Save pieces, follow your orders and hear about drops first. You can always check out as a guest.</p>

      {done ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Almost there.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your details are ready for the account service. <Link to="/shop" className="text-foreground underline underline-offset-4">Keep shopping</Link></p>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block text-sm">Full name<input required name="name" autoComplete="name" className="field mt-2" /></label>
          <label className="block text-sm">Email<input required type="email" name="email" autoComplete="email" className="field mt-2" /></label>
          <label className="block text-sm">Phone<input required type="tel" name="phone" placeholder="07XX XXX XXX" pattern="(?:\+254|0)[17][0-9]{8}" className="field mt-2" /></label>
          <label className="block text-sm">Password<input required type="password" name="password" minLength={8} autoComplete="new-password" className="field mt-2" /></label>
          <label className="flex items-start gap-2 text-xs text-muted-foreground"><input type="checkbox" required className="mt-0.5 accent-[var(--color-accent)]" /> I agree to the Thift Nairobi terms and privacy policy.</label>
          <Button className="w-full" type="submit">Create account</Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-foreground underline underline-offset-4">Sign in</Link></p>
      {/* TODO: Connect registration to the Express backend when it is ready. */}
    </div>
  );
}
