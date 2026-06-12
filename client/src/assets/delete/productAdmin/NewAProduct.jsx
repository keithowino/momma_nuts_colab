import { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const url = "http://127.0.0.1:5000";

// function LocationPicker({ setLatitude, setLongitude }) {
//     useMapEvents({
//         click(e) {
//             setLatitude(e.latlng.lat);
//             setLongitude(e.latlng.lng);
//         },
//     });
//     return null;
// }

function NewAProduct({ products, setProducts }) {
    const [newProduct, setNewProduct] = useState({
        name: "",
        image: "",
        description: "",
        price: 0,
        stock: 0
    });

    const [uploading, setUploading] = useState(false);

    function handleChange(e) {
        let { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
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
            setNewProduct((prev) => ({ ...prev, image: data.secure_url }));
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        fetch(`${url}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newProduct),
        })
            .then((resp) => resp.json())
            .then((newProductData) => {
                setProducts((prevProducts) => [...prevProducts, newProductData]);  // ✅ This ensures proper reactivity
                setNewProduct({ 
                    name: "", 
                    image: "", 
                    description: "", 
                    price: 0, 
                    stock: 0 
                });
                alert(`${newProductData.name} created successfully!`);
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="admin-form-container">
            <h2 className="admin-form-title">Add New Product</h2>
            <form id="new-product" onSubmit={handleSubmit} className="admin-form">
                <input className="admin-input" type="text" name="name" placeholder="Product Name" value={newProduct.name} required onChange={handleChange} />

                <input type="file" onChange={handleImageUpload} className="admin-input" accept="image/*" required />
                {uploading && <p className="uploading-text">Uploading...</p>}
                {newProduct.image && <img src={newProduct.image} alt="Uploaded Preview" className="preview-image" />}

                <input className="admin-input" type="text" name="description" placeholder="Description" value={newProduct.description} required onChange={handleChange} />
                <input className="admin-input" type="number" name="price" placeholder="Price" value={newProduct.price} required onChange={handleChange} />
                <input className="admin-input" type="number" name="stock" placeholder="Stock Quantity" value={newProduct.stock} required onChange={handleChange} />

                <button className="admin-submit-btn" type="submit">Add Product</button>
            </form>
        </div>
    );
}

export default NewAProduct;
