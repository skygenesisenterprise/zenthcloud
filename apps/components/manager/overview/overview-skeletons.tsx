"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewPageSkeleton() {
  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10" aria-busy="true" aria-label="Chargement">
      {/* En-tête */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="space-y-3">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-36" />
            <Skeleton className="mt-3 h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Grille principale */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-7 w-24" />
            </div>
            <Skeleton className="m-5 h-52 rounded-md" />
          </div>
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-4">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-4 h-2 w-full" />
              <Skeleton className="mt-3 h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
