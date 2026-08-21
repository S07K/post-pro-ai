"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import PostCard from "../../components/Card";
import { getRecentPosts } from "@/lib/api/client";
import type { PostDTO } from "@/types";

function CardSkeleton() {
  return (
    <Card className="py-1 w-[300px]">
      <CardBody className="overflow-visible py-2">
        <Skeleton className="rounded-xl w-[300px] h-[200px]" />
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2 pt-0">
        <Skeleton className="rounded-full w-16 h-5" />
        <Skeleton className="rounded-lg w-full h-4" />
      </CardFooter>
    </Card>
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
      <div className="flex overflow-auto hide-scroll gap-6 pt-4">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="pt-4 text-default-50">No posts yet. Create a project and generate your first post to see it here.</p>;
  }

  return (
    <div className="flex overflow-auto hide-scroll gap-6 pt-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CardsContainer;
