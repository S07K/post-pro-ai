"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@nextui-org/react";
import InfoCard from "./InfoCard";
import { GraphIcon } from "../../icons/GraphIcon";
import { FollowersIcon } from "../../icons/FollowersIcon";
import PostViewsChart from "./AreaChartContainer";
import { LikesIcon } from "../../icons/LikesIcon";
import { getAnalytics } from "@/lib/api/client";
import type { AnalyticsDTO } from "@/types";

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsDTO | null>(null);

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch(() => toast.error("Failed to load analytics"));
  }, []);

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[98px] rounded-lg" />
        ))}
      </div>
    );
  }

  const postsPerWeekData = analytics.postsPerWeek.map((bucket) => ({ name: bucket.week, value: bucket.count }));
  const byStatusData = [
    { name: "Posted", value: analytics.byStatus.posted },
    { name: "Scheduled", value: analytics.byStatus.scheduled },
    { name: "Processing", value: analytics.byStatus.processing },
    { name: "Draft", value: analytics.byStatus.draft },
    { name: "Failed", value: analytics.byStatus.failed },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard title="Total posts" count={analytics.totalPosts} icon={<GraphIcon />} tone="blue" />
        <InfoCard title="Projects" count={analytics.totalProjects} icon={<FollowersIcon />} tone="green" />
        <InfoCard title="Posted to Instagram" count={analytics.byStatus.posted} icon={<LikesIcon />} tone="yellow" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PostViewsChart data={postsPerWeekData} id="posts-per-week" title="Posts created" subtitle="Last 8 weeks" chartColor="#0866FF" />
        <PostViewsChart data={byStatusData} id="posts-by-status" title="Posts by status" subtitle="All time" chartColor="#31A24C" />
      </div>
    </div>
  );
};

export default Analytics;
