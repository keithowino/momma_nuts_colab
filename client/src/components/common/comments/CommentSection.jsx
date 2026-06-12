import React, { useState, useEffect } from "react";
import {
	FiMessageSquare,
	FiSend,
	FiTrash2,
	FiChevronDown,
	FiChevronUp,
	FiUser,
	FiStar,
} from "react-icons/fi";
import { ReplyIcon } from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

const CommentSection = ({ productId }) => {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [expandedReplies, setExpandedReplies] = useState({});

	useEffect(() => {
		// Get current user from localStorage
		const user = localStorage.getItem("user");
		if (user) {
			setCurrentUser(JSON.parse(user));
		}
		fetchComments();
	}, [productId]);

	const fetchComments = async () => {
		try {
			const response = await fetch(
				`${API_URL}/comments/product/${productId}`,
			);
			if (response.ok) {
				const data = await response.json();
				setComments(Array.isArray(data) ? data : []);
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePostComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to comment");
			return;
		}

		setSubmitting(true);
		try {
			const response = await fetch(`${API_URL}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					content: newComment,
					product_id: productId,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setComments([data, ...comments]);
				setNewComment("");
			} else {
				const error = await response.json();
				alert(error.error || "Failed to post comment");
			}
		} catch (error) {
			console.error("Error posting comment:", error);
			alert("Network error. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeleteComment = async (
		commentId,
		isReply = false,
		parentId = null,
	) => {
		if (!window.confirm("Are you sure you want to delete this?")) return;

		const token = localStorage.getItem("access_token");
		const url = isReply
			? `${API_URL}/comments/${parentId}/replies/${commentId}`
			: `${API_URL}/comments/${commentId}`;

		try {
			const response = await fetch(url, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.ok) {
				if (isReply) {
					// Update replies in the specific comment
					setComments((prevComments) =>
						prevComments.map((comment) =>
							comment.id === parentId
								? {
										...comment,
										replies: comment.replies.filter(
											(r) => r.id !== commentId,
										),
									}
								: comment,
						),
					);
				} else {
					setComments(comments.filter((c) => c.id !== commentId));
				}
			} else {
				alert("Failed to delete");
			}
		} catch (error) {
			console.error("Error deleting:", error);
			alert("Network error");
		}
	};

	const handlePostReply = async (
		commentId,
		replyContent,
		setReplyContent,
		setShowReply,
	) => {
		if (!replyContent.trim()) return;

		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to reply");
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}/comments/${commentId}/replies`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content: replyContent }),
				},
			);

			if (response.ok) {
				const newReply = await response.json();
				setComments((prevComments) =>
					prevComments.map((comment) =>
						comment.id === commentId
							? {
									...comment,
									replies: [
										...(comment.replies || []),
										newReply,
									],
								}
							: comment,
					),
				);
				setReplyContent("");
				setShowReply(false);
			}
		} catch (error) {
			console.error("Error posting reply:", error);
			alert("Failed to post reply");
		}
	};

	const toggleReplies = (commentId) => {
		setExpandedReplies((prev) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	if (loading) {
		return (
			<div className="flex justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-sm mt-8">
			{/* Header */}
			<div className="flex items-center gap-2 p-6 border-b">
				<FiMessageSquare className="text-momma-pink text-xl" />
				<h2 className="text-xl font-semibold text-momma-brown">
					Customer Reviews & Comments
				</h2>
				<span className="text-gray-500 text-sm ml-2">
					({comments.length})
				</span>
			</div>

			{/* Comment Form */}
			<div className="p-6 border-b bg-gray-50">
				<form onSubmit={handlePostComment} className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 rounded-full bg-gradient-to-r from-momma-pink to-momma-orange flex items-center justify-center text-white font-bold">
							{currentUser
								? currentUser.name?.charAt(0).toUpperCase()
								: "?"}
						</div>
						<div className="flex-1">
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder={
									currentUser
										? "Share your thoughts about this product..."
										: "Please login to leave a comment"
								}
								disabled={!currentUser || submitting}
								rows="3"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink resize-none"
							/>
							<div className="flex justify-end mt-2">
								<button
									type="submit"
									disabled={
										!currentUser ||
										submitting ||
										!newComment.trim()
									}
									className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm"
								>
									{submitting ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										<FiSend />
									)}
									Post Comment
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>

			{/* Comments List */}
			<div className="divide-y">
				{comments.length === 0 ? (
					<div className="text-center py-12 text-gray-500">
						<FiMessageSquare className="text-4xl mx-auto mb-3 text-gray-300" />
						<p>
							No comments yet. Be the first to share your
							thoughts!
						</p>
					</div>
				) : (
					comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							currentUser={currentUser}
							onDelete={() => handleDeleteComment(comment.id)}
							onReply={(
								replyContent,
								setReplyContent,
								setShowReply,
							) =>
								handlePostReply(
									comment.id,
									replyContent,
									setReplyContent,
									setShowReply,
								)
							}
							onDeleteReply={(replyId) =>
								handleDeleteComment(replyId, true, comment.id)
							}
							expandedReplies={expandedReplies[comment.id]}
							onToggleReplies={() => toggleReplies(comment.id)}
						/>
					))
				)}
			</div>
		</div>
	);
};

// Individual Comment Component
const CommentItem = ({
	comment,
	currentUser,
	onDelete,
	onReply,
	onDeleteReply,
	expandedReplies,
	onToggleReplies,
}) => {
	const [showReply, setShowReply] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [submittingReply, setSubmittingReply] = useState(false);
	const isOwner = currentUser?.id === comment.user?.id;

	const handleSubmitReply = async (e) => {
		e.preventDefault();
		if (!replyContent.trim()) return;
		setSubmittingReply(true);
		await onReply(replyContent, setReplyContent, setShowReply);
		setSubmittingReply(false);
	};

	return (
		<div className="p-6 hover:bg-gray-50 transition-colors">
			<div className="flex gap-3">
				{/* Avatar */}
				<div className="flex-shrink-0">
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
							isOwner
								? "bg-gradient-to-r from-momma-pink to-momma-orange"
								: "bg-gradient-to-r from-gray-400 to-gray-500"
						}`}
					>
						{comment.user?.name?.charAt(0).toUpperCase() || "U"}
					</div>
				</div>

				{/* Comment Content */}
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-semibold text-momma-brown">
							{comment.user?.name || "Anonymous"}
						</span>
						<span className="text-xs text-gray-500">
							{new Date(comment.created_at).toLocaleDateString()}
						</span>
						{isOwner && (
							<span className="text-xs bg-pink-50 text-momma-pink px-2 py-0.5 rounded-full">
								You
							</span>
						)}
					</div>
					<p className="text-gray-700 mb-3">{comment.content}</p>

					{/* Action Buttons */}
					<div className="flex items-center gap-4 text-sm">
						<button
							onClick={() => setShowReply(!showReply)}
							className="flex items-center gap-1 text-gray-500 hover:text-momma-pink transition-colors"
						>
							<ReplyIcon className="text-sm" />
							Reply
						</button>
						{comment.replies && comment.replies.length > 0 && (
							<button
								onClick={onToggleReplies}
								className="flex items-center gap-1 text-gray-500 hover:text-momma-pink transition-colors"
							>
								{expandedReplies ? (
									<FiChevronUp />
								) : (
									<FiChevronDown />
								)}
								{comment.replies.length}{" "}
								{comment.replies.length === 1
									? "Reply"
									: "Replies"}
							</button>
						)}
						{isOwner && (
							<button
								onClick={onDelete}
								className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
							>
								<FiTrash2 className="text-sm" />
								Delete
							</button>
						)}
					</div>

					{/* Reply Form */}
					{showReply && (
						<form onSubmit={handleSubmitReply} className="mt-4">
							<div className="flex gap-2">
								<input
									type="text"
									value={replyContent}
									onChange={(e) =>
										setReplyContent(e.target.value)
									}
									placeholder="Write a reply..."
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink text-sm"
									disabled={submittingReply}
								/>
								<button
									type="submit"
									disabled={
										submittingReply || !replyContent.trim()
									}
									className="btn-primary px-4 py-2 text-sm flex items-center gap-1"
								>
									{submittingReply ? (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									) : (
										<FiSend />
									)}
									Post
								</button>
							</div>
						</form>
					)}

					{/* Replies */}
					{expandedReplies &&
						comment.replies &&
						comment.replies.length > 0 && (
							<div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
								{comment.replies.map((reply) => (
									<div key={reply.id} className="flex gap-2">
										<div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-xs">
											{reply.user?.name
												?.charAt(0)
												.toUpperCase() || "U"}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-0.5">
												<span className="font-medium text-sm text-momma-brown">
													{reply.user?.name ||
														"Anonymous"}
												</span>
												<span className="text-xs text-gray-500">
													{new Date(
														reply.created_at,
													).toLocaleDateString()}
												</span>
											</div>
											<p className="text-gray-600 text-sm">
												{reply.content}
											</p>
											{currentUser?.id ===
												reply.user?.id && (
												<button
													onClick={() =>
														onDeleteReply(reply.id)
													}
													className="text-xs text-red-500 hover:text-red-700 mt-1"
												>
													Delete
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						)}
				</div>
			</div>
		</div>
	);
};

export default CommentSection;
