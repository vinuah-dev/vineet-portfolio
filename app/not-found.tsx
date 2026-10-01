import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main id="main" className="grid-bg relative grid min-h-[100svh] place-items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--bg)_70%)]" />
      <div className="container-x relative text-center">
        <p className="micro text-accent">Error 404 · route not found</p>
        <h1 className="display mt-6 text-[clamp(4rem,16vw,12rem)]">
          Lost <span className="font-serif font-normal italic text-fg-muted">signal.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-fg-muted">This page doesn&apos;t exist, or it moved somewhere better.</p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </div>
    </main>
  );
}
