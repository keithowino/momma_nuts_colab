import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const backendUrl = "http://127.0.0.1:5000";

function ProductCard({ product, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes?.length || 0);

  useEffect(() => {
    if (currentUser) {
      fetch(`${backendUrl}/products/${product.id}/likes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLiked(data.liked);
          setLikesCount(data.likes_count);
        })
        .catch((err) => console.error("Error checking like status:", err));
    }
  }, [product.id, currentUser]);

  const handleLikeToggle = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const method = liked ? "DELETE" : "POST";

    fetch(`${backendUrl}/products/${product.id}/likes`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (liked) {
          setLiked(false);
          setLikesCount((prev) => prev - 1);
        } else {
          setLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      })
      .catch((err) => console.error("Error toggling like:", err));
  };

  return (
    <div className="product-card">
      <div className="product-info-section">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button
            onClick={handleLikeToggle}
            className="like-btn"
            aria-label={liked ? "Unlike" : "Like"}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{likesCount}</span>
          </button>
          <span className="product-price">${product.price}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;