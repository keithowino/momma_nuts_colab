import { useState } from "react";
import { Link } from "react-router-dom";

const url = "http://127.0.0.1:5000";

function AProductItem({ name, image, id, description, price, stock, setProduct, product }) {
  const [update, setUpdate] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    stock: ""
  });

  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    let { name, value } = e.target;
    setUpdate({ ...update, [name]: value });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_uploads");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dvjkvk71s/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUpdate((prev) => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  function handleUpdate(e) {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      alert("You must be logged in to update products.");
      return;
    }
  
    fetch(`${url}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(update)
    })
      .then(resp => resp.json())
      .then((updated) => {
        if (updated.error) {
          throw new Error(updated.error);  // Handle errors properly
        }
  
        console.log("Updated product:", updated);
  
        // ✅ Ensure React recognizes the state change
        setProduct(prevProducts => 
          prevProducts.map(prod => 
            prod.id === id ? updated : prod
          )
        );
  
        setUpdate({ name: "", image: "", description: "", price: "", stock: "" });
        alert(`${updated.name} has been updated successfully!`);
      })
      .catch(err => console.error("Error updating product:", err));
  }
  

  function handleDelete() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You must be logged in to delete products.");
      return;
    }

    fetch(`${url}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to delete. Unauthorized or invalid request.");
        }
        return res.json();
      })
      .then(() => {
      // 👇 Remove the soft-deleted product from local state/UI
      let remainder = product.filter(prod => prod.id !== id);
      setProduct(remainder);
      alert(`${name} has been soft-deleted successfully! 👋🏽`);
    })
      .catch(err => console.error("Error deleting product:", err));
  }

  return (
    <div id="content">
      <h2 className="mini">Name</h2>
      <p className="aprod-name"><strong>{name}</strong></p>
      <img className="aprod-image" src={image} alt={name} />
      <h3 className="mini">Description</h3>
      <h2 className="aprod-description "><strong>{description}</strong></h2>
      <h3 className="mini">Price</h3>
      <h2 className="aprod-price"><strong>${price}</strong></h2>
      <h3 className="mini">Stock</h3>
      <h2 className="aprod-stock"><strong>{stock} available</strong></h2>

      <form id="new" onSubmit={handleUpdate}>
        <input className="input" type="text" name="name" placeholder="Name" value={update.name} required onChange={handleChange} /><br />

        <input type="file" onChange={handleImageUpload} className="input" accept="image/*" required /><br />
        {uploading && <p>Uploading...</p>}
        {update.image && <img src={update.image} alt="Uploaded Preview" className="w-32 h-32 mt-2" />}

        <input className="input" type="text" name="description" placeholder="Description" value={update.description} required onChange={handleChange} /><br />
        <input className="input" type="number" name="price" placeholder="Price" value={update.price} required onChange={handleChange} /><br />
        <input className="input" type="number" name="stock" placeholder="Stock" value={update.stock} required onChange={handleChange} /><br />

        <button className="update" type="submit">Update</button>
      </form>

      <button className="delete" onClick={handleDelete}>Delete</button><br />
      <Link to={`/productDetails/${id}`}>
        <button className="mini">View Details</button>
      </Link>
    </div>
  );
}

export default AProductItem;
