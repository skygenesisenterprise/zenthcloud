"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Cloud, Pause, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

interface HeroSlide {
  title: string;
  subtitle: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  oldPrice: string;
  price: string;
  priceTtc?: string;
  tagline: string;
}

interface HeroCarouselProps {
  badge: string;
  priceLabel: string;
  pricePeriod: string;
  primaryCta: string;
  secondaryCta?: string;
  slides: HeroSlide[];
}

export function HeroCarousel({
  badge,
  priceLabel,
  pricePeriod,
  primaryCta,
  secondaryCta,
  slides,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  React.useEffect(() => {
    if (paused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [paused, nextSlide, slides.length]);

  const slide = slides[activeIndex];
  const bullets = [slide.bullet1, slide.bullet2, slide.bullet3];

  return (
    <section
      className="relative flex flex-col overflow-hidden text-white min-h-140 md:min-h-150 md:max-h-160"
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #c026d3 35%, #f97316 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.08),transparent_40%)]" />

      <Container className="relative flex flex-1 items-start py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </span>
            <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-balance">
              {slide.title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>
            <ul className="mt-6 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm md:text-base text-white/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-sm text-white/90">
              <span className="align-middle">{priceLabel}</span>{" "}
              {slide.oldPrice && (
                <span className="align-middle text-base line-through text-white/60">{slide.oldPrice}</span>
              )}{" "}
              <span className="align-middle text-2xl font-bold text-white">{slide.price}</span>{" "}
              <span className="align-middle">{pricePeriod}</span>
              {slide.priceTtc && (
                <span className="ml-2 align-middle text-white/90">
                  soit <span className="text-xl font-bold text-white">{slide.priceTtc}</span> TTC/mois
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="/pricing">{primaryCta}</Link>
              </Button>
              {secondaryCta && (
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/contact">{secondaryCta}</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-white/60">{slide.tagline}</p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
              <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-white/40" />
                      <span className="h-3 w-3 rounded-full bg-white/25" />
                      <span className="h-3 w-3 rounded-full bg-white/15" />
                    </div>
                    <span className="text-xs font-medium text-white/70">ZenthCloud</span>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="relative">
                      <div className="flex h-40 w-56 items-center justify-center rounded-xl bg-linear-to-br from-white/25 to-white/5 border border-white/20 shadow-xl">
                        <Cloud className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -bottom-5 -right-6 h-24 w-24 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Server className="h-12 w-12 text-white/90" />
                      </div>
                      <div className="absolute -top-5 -left-6 h-16 w-16 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-white/90" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg bg-white/10 p-4 text-center">
                        <div className="mx-auto h-8 w-8 rounded-full bg-white/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {slides.length > 1 && (
        <>
          <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide précédent"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide suivant"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${index === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Lecture" : "Pause"}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <Pause className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
