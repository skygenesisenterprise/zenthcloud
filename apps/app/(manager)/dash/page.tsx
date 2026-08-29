"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { fetchOverview, type OverviewData } from "@/lib/mock/overview";
import { OverviewHeader } from "@/components/manager/overview/overview-header";
import { StatCards } from "@/components/manager/overview/stat-cards";
import { SpendingChart } from "@/components/manager/overview/spending-chart";
import { InstancesOverview } from "@/components/manager/overview/instances-overview";
import { UsagePanel } from "@/components/manager/overview/usage-panel";
import { RegionBreakdown } from "@/components/manager/overview/region-breakdown";
import { ActivityFeed } from "@/components/manager/overview/activity-feed";
import { DeploymentCard, SecurityCard } from "@/components/manager/overview/insights";
import { OverviewPageSkeleton } from "@/components/manager/overview/overview-skeletons";

const sectionMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function OverviewPage() {
  const [data, setData] = React.useState<OverviewData | null>(null);

  React.useEffect(() => {
    let active = true;
    fetchOverview().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return <OverviewPageSkeleton />;
  }

  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
      <OverviewHeader />

      <motion.div {...sectionMotion}>
        <StatCards stats={data.stats} />
      </motion.div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <motion.div
          {...sectionMotion}
          transition={{ ...sectionMotion.transition, delay: 0.08 }}
          className="flex flex-col gap-6"
        >
          <SpendingChart points={data.spending} total={data.totalSpent} />
          <InstancesOverview instances={data.instances} />
        </motion.div>

        <motion.div
          {...sectionMotion}
          transition={{ ...sectionMotion.transition, delay: 0.16 }}
          className="flex flex-col gap-6"
        >
          <UsagePanel budget={data.budget} />
          <RegionBreakdown regions={data.regions} />
          <ActivityFeed events={data.activity} />
        </motion.div>
      </div>

      <motion.div
        {...sectionMotion}
        transition={{ ...sectionMotion.transition, delay: 0.24 }}
        className="mt-6 grid gap-4 md:grid-cols-3"
      >
        <DeploymentCard />
        <SecurityCard />
      </motion.div>
    </main>
  );
}
