import React from "react";
import InfoCard from "./InfoCard";
import { GraphIcon } from "../../icons/GraphIcon";
import { FollowersIcon } from "../../icons/FollowersIcon";
import PostViewsChart from "./AreaChartContainer";
import { LikesIcon } from "../../icons/LikesIcon";

interface AnalyticsProps {
  // Define the props for the Analytics component here
}

const Analytics: React.FC<AnalyticsProps> = () => {
  const data1 = [
    {
      "name": "Page A",
      "value": 4000,
    },
    {
      "name": "Page B",
      "value": 3000,
    },
    {
      "name": "Page C",
      "value": 2000,
    },
    {
      "name": "Page D",
      "value": 2780,
    },
    {
      "name": "Page E",
      "value": 1890,
    },
    {
      "name": "Page F",
      "value": 2390,
    },
    {
      "name": "Page G",
      "value": 3490,
    }
  ]

  const data2 = [
    {
      "name": "Page A",
      "value": 2400,
    },
    {
      "name": "Page B",
      "value": 1398,
    },
    {
      "name": "Page C",
      "value": 9800,
    },
    {
      "name": "Page D",
      "value": 3908,
    },
    {
      "name": "Page E",
      "value": 4800,
    },
    {
      "name": "Page F",
      "value": 3800,
    },
    {
      "name": "Page G",
      "value": 4300,
    }
  ]
  return (
    <>
      <section id="analytics" className="pt-4 flex gap-6 flex-col sm:flex-row">
        <InfoCard
          title="Total post views"
          start={2000}
          count={3041}
          icon={<GraphIcon />}
          bg="bg-[#80AF81]"
        />
        <InfoCard
          title="Followers"
          count={300}
          icon={<FollowersIcon />}
          bg="bg-[#6EACDA]"
        />
        <InfoCard
          title="Average Likes"
          count={433}
          icon={<LikesIcon />}
          bg="bg-[#EF5A6F]"
        />
      </section>
      <section className="pt-10 flex gap-6 flex-col sm:flex-row">
        <div className="w-full flex flex-wrap gap-5">
            <PostViewsChart data={data1} id="content-performance" title={"Content Performance"} chartColor={"#80AF81"} />
            <PostViewsChart data={data2} id="followings-performance" title={"Audience"} chartColor={"#6EACDA"} />
        </div>
      </section>
    </>
  );
};

export default Analytics;
