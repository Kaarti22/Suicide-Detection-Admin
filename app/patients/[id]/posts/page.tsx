"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for a post
interface Post {
  id: number;
  content: string;
  user_id: number;
}

export default function PatientPosts() {
  const [posts, setPosts] = useState<Post[]>([]); // Explicitly define state type

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>("/api/getPosts"); // Ensure axios response is typed
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Recent Patient Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border p-4 my-2">
            <p>{post.content}</p>
            <small>Posted by User ID: {post.user_id}</small>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
