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
      <div className="pt-4 flex gap-6 flex-col sm:flex-row">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="rounded-large w-full sm:w-[300px] h-[100px]" />
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
    <>
      <section id="analytics" className="pt-4 flex gap-6 flex-col sm:flex-row">
        <InfoCard title="Total posts" count={analytics.totalPosts} icon={<GraphIcon />} bg="bg-[#80AF81]" />
        <InfoCard title="Projects" count={analytics.totalProjects} icon={<FollowersIcon />} bg="bg-[#6EACDA]" />
        <InfoCard title="Posted to Instagram" count={analytics.byStatus.posted} icon={<LikesIcon />} bg="bg-[#EF5A6F]" />
      </section>
      <section className="pt-10 flex gap-6 flex-col sm:flex-row">
        <div className="w-full flex flex-wrap gap-5">
          <PostViewsChart data={postsPerWeekData} id="posts-per-week" title="Posts created (last 8 weeks)" chartColor="#80AF81" />
          <PostViewsChart data={byStatusData} id="posts-by-status" title="Posts by status" chartColor="#6EACDA" />
        </div>
      </section>
    </>
  );
};

export default Analytics;
