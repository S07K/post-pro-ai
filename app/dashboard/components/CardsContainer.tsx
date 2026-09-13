"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@nextui-org/react";
import PostCard from "../../components/Card";
import { getRecentPosts } from "@/lib/api/client";
import type { PostDTO } from "@/types";

function CardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 overflow-hidden rounded-lg border border-divider bg-content1">
      <Skeleton className="h-[200px] w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
    </div>
  );
}

const CardsContainer: React.FC = () => {
  const [posts, setPosts] = useState<PostDTO[] | null>(null);

  useEffect(() => {
    getRecentPosts()
      .then(setPosts)
      .catch(() => {
        setPosts([]);
        toast.error("Failed to load recent posts");
      });
  }, []);

  if (posts === null) {
    return (
      <div className="hide-scroll flex gap-4 overflow-x-auto">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-default-300 bg-default-100 px-6 py-10 text-center">
        <p className="text-[15px] font-semibold text-default-900">No posts yet</p>
        <p className="mt-1 text-sm text-default-600">Create a project and generate your first post to see it here.</p>
      </div>
    );
  }

  return (
    <div className="hide-scroll -mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
      {posts.map((post) => (
        <div key={post.id} className="w-[260px] shrink-0">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default CardsContainer;
