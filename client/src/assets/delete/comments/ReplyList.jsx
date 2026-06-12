import React from "react";

const URL = "http://127.0.0.1:5000"; // Or use your env-based backend URL

const ReplyList = ({ replies, setReplies, currentUser, parentCommentId }) => {
  if (!replies || replies.length === 0) {
    return <p className="text-sm text-gray-400 ml-4">No replies yet.</p>;
  }

  const handleDeleteReply = (replyId) => {
  if (!window.confirm("Are you sure you want to delete this reply?")) return;

  fetch(`${URL}/comments/${parentCommentId}/replies/${replyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw new Error(err.message || "Failed to delete reply");
        });
      }
      return res.text(); // Assume empty response
    })
    .then(() => {
      setReplies((prevReplies) =>
        prevReplies.filter((r) => r.id !== replyId)
      );
    })
    .catch((err) => {
      console.error("Error deleting reply:", err.message);
    });
};

  return (
    <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
      {replies.map((reply) => (
        <div key={reply.id} className="mb-2">
          <p className="text-sm font-semibold">{reply.user.name}</p>
          <p className="text-base">{reply.content}</p>
          <button
            className={`text-xs ml-2 ${
              currentUser?.id === reply.user.id
                ? "text-red-500"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => handleDeleteReply(reply.id)}
            disabled={currentUser?.id !== reply.user.id}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReplyList;
