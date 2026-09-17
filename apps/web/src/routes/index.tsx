import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/thift-hero.jpg";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Thift Nairobi — Curated Secondhand Style" },
    { name: "description", content: "Shop thoughtfully sourced vintage and secondhand fashion, curated in Nairobi." },
    { property: "og:title", content: "Thift Nairobi — Curated Secondhand Style" },
    { property: "og:description", content: "Thoughtfully sourced vintage and secondhand fashion, curated in Nairobi." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Home,
});
function Home() { return <>
  <section className="relative overflow-hidden"><div className="pointer-events-none absolute right-0 top-0 size-96 rounded-full bg-accent/10 blur-3xl"/><div className="mx-auto grid max-w-[1320px] items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20 lg:gap-16">
    <div className="rise"><p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Curated in Nairobi · One of one</p><h1 className="max-w-[10ch] font-display text-6xl font-medium leading-[.9] sm:text-7xl lg:text-8xl">Curated Secondhand <em className="text-accent">Style.</em></h1><p className="mt-7 max-w-[38ch] text-base leading-relaxed text-foreground/70">Thoughtfully sourced vintage pieces with soul, style and stories. Thrifted in Kenya, made to be loved again.</p><Link to="/shop" search={{ sort: "newest" }} className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">Shop New Drops <ArrowRight className="size-4"/></Link></div>
    <figure className="rise relative mx-auto w-full max-w-xl"><div className="absolute -inset-4 rounded-3xl bg-primary/5 backdrop-blur-sm"/><span className="absolute -left-3 -top-4 z-10 rounded-full border border-border bg-background/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] backdrop-blur">Nairobi · Est. 2026</span><img src={heroImage} alt="Woman styled in a vintage paisley blouse and tailored trousers" width={1024} height={1280} className="relative aspect-[4/5] w-full rounded-2xl object-cover"/></figure>
  </div></section>
  <section className="mx-auto max-w-[1320px] px-6 pb-8"><div className="mb-9 text-center"><h2 className="font-display text-4xl font-medium sm:text-5xl">New Arrivals</h2><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground">06 pieces · updated weekly</p></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-6">{products.map((p) => <ProductCard key={p.slug} product={p}/>)}</div><div className="mt-12 text-center"><Link to="/shop" className="inline-flex rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">View the full collection</Link></div></section>
</>; }
