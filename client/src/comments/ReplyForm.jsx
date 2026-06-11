import React, { useState } from 'react';

const backendUrl = "http://127.0.0.1:5000"; // Adjust if needed

const ReplyForm = ({ commentId, onReplyAdded }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    fetch(`${backendUrl}/comments/${commentId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        content: replyContent,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to post reply");
        }
        return res.json();
      })
      .then((data) => {
        onReplyAdded(data);
        setReplyContent('');
      })
      .catch((err) => {
        console.error("Error posting reply:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleReplySubmit} className="mt-2 flex items-center gap-2 ml-4">
      <input
        type="text"
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-grow p-2 border border-gray-300 rounded-md"
        disabled={loading}
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default ReplyForm;
