import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import CommentSection from "../comments/CommentSection";

const backendUrl = "http://127.0.0.1:5000";

function UProductItem({ id, name, image, description, price, stock, nameColor, descColor, bgColor}) {
  const [loading, setLoading] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const token = localStorage.getItem("access_token");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch(`${backendUrl}/products/${id}/likes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLiked(data.liked);
          setLikesCount(data.likes_count);
        })
        .catch((err) => console.error("Error checking like status:", err));
    }
  }, [id, token]);

  useEffect(() => {
    if (token) {
      fetch(`${backendUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json(); 
        })
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error("Error fetching current user:", err));
    }
  }, [token]);
  

  const handleLikeToggle = () => {
    if (!token) return;
    const method = liked ? "DELETE" : "POST";

    fetch(`${backendUrl}/products/${id}/likes`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setLiked(!liked);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      })
      .catch((err) => console.error("Error toggling like:", err));
  };

  const handleAddToCart = () => {
    if (!token) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    setLoading(true);

    fetch(`${backendUrl}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: id, quantity: 1 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add to cart");
        return res.json();
      })
      .then(() => alert(`${name} added to cart!`))
      .catch((err) => console.error("Error adding to cart:", err))
      .finally(() => setLoading(false));
  };

  const toggleCommentSection = () => {
    setShowCommentSection((prev) => !prev);
  };

  return (
    <div className="product-card" style={{ backgroundColor: bgColor }}>
      <div className="product-image-section">
        <div className="image-container">
          <h2 className="product-name" style={{ color: nameColor }}>{name}</h2>
          <img className="product-image" src={image} alt={name} />
        </div>
        <div className="product-actions">
          <button onClick={handleLikeToggle} className="like-btn">
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span className="ml-1 text-sm">{likesCount}</span>
          </button>
          <button onClick={toggleCommentSection} className="comment-btn">
            <FaRegComment />
          </button>
        </div>
      </div>
      <div className="product-info-section">
        <p className="product-description" style={{ color: descColor }}>{description}</p>
        <h3 className="product-stock">Stock: {stock} available</h3>
        <h3 className="product-price">Price: ${price}</h3>
        <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={loading}>
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
      {showCommentSection && currentUser && (
        <div className="comment-section">
          <h3>Comments</h3>
          <CommentSection productId={id} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}

export default UProductItem;
