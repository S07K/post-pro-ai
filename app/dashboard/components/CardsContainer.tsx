"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import PostCard from "../../components/Card";
import { getRecentPosts } from "@/lib/api/client";
import type { PostDTO } from "@/types";

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
      <div className="flex justify-center pt-4">
        <Spinner />
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
