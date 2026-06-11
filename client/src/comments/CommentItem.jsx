import React, { useState } from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';

const URL = "http://127.0.0.1:5000"

const CommentItem = ({ comment, currentUser, onDelete }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyInputVisible, setReplyInputVisible] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleDeleteComment = () => {
  if (!window.confirm("Are you sure you want to delete this comment?")) return;

  fetch(`${URL}/comments/${comment.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => {
          if (res.status === 403) {
            alert("You are not authorized to delete this comment.");
          }
          throw new Error(err.message || 'Failed to delete comment');
        });
      }
      return res.text().then(text => (text ? JSON.parse(text) : {}));
    })
    .then(() => {
      console.log("Comment soft-deleted successfully");
      if (onDelete) {
        onDelete(comment.id); // Remove from UI (assumes parent filters out)
      }
    })
    .catch((err) => {
      console.error("Error deleting comment:", err.message);
    });
};
  
const isCommentOwner = currentUser?.id === comment.user.id;
// console.log("currentUser.id:", currentUser?.id, "comment.user.id:", comment.user?.id);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold">{comment.user.name}</p>
          <p className="text-base">{comment.content}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-2 text-sm text-gray-600">
        <button onClick={() => setShowReplies(prev => !prev)}>
          {showReplies ? "Hide Replies" : "View Replies"}
        </button>
        <button onClick={() => setReplyInputVisible(prev => !prev)}>Reply</button>
      </div>

      {/* {showReplies && <ReplyList replies={replies} />} */}
      {showReplies && (
        <ReplyList
          replies={replies}
          setReplies={setReplies}
          currentUser={currentUser}
          parentCommentId={comment.id}
        />
      )}

      {replyInputVisible && (
        <ReplyForm
          commentId={comment.id}
          onReplyAdded={(newReply) => setReplies(prev => [...prev, newReply])}
        />
      )}


<button
  className={`text-sm ml-2 ${isCommentOwner ? 'text-red-500' : 'text-gray-400 cursor-not-allowed'}`}
  onClick={handleDeleteComment}
  disabled={!isCommentOwner}
>
  Delete
</button>
    </div>
  );
};

export default CommentItem;
