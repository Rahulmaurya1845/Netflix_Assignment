import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts`);
        setPosts(res.data);
        console.log(" FETCHED POSTS:", res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      console.log(" handleDelete called with:", postId);

      if (!postId) {
        alert(" Missing post ID — check console for post data.");
        return;
      }

      const url = `${API_BASE}/posts/${postId}`;
      console.log("📡 Sending DELETE to:", url);

      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(" Delete Response:", res.data);

      setPosts((prev) => prev.filter((p) => p._id !== postId));

      alert(" Post deleted successfully!");
    } catch (err) {
      console.error(" Error deleting post:", err.response?.data || err.message);
      alert("Failed to delete post: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <h2>Public Feed</h2>

      {posts.length === 0 && <div className="card">No posts yet</div>}

      {posts.map((post) => (
        <div key={post._id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{post.user?.name}</div>
              <div className="post-meta">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <button
                className="btn secondary"
                onClick={() => {
                  console.log("🧾 Deleting post:", post);
                  handleDelete(post._id);
                }}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </div>
          </div>

          <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{post.text}</div>

          {post.image && (
            <img
              className="post-image"
              src={
                (process.env.REACT_APP_API_URL
                  ? process.env.REACT_APP_API_URL.replace("/api", "")
                  : "http://localhost:5000") + post.image
              }
              alt=""
              style={{ marginTop: 10, maxWidth: "100%", borderRadius: 8 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
