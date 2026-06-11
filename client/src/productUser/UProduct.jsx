import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UProductList from "./UProductList";
import "./UProduct.css"

const url = "http://127.0.0.1:5000";

function UProduct() {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        fetch(`${url}/products`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch products"); 
            }
            return res.json();
        })
        .then((data) => {
            setProduct(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching products:", err));
    }, []);

    return (
        <>
            <h1 className="mainH">Products</h1>
            <UProductList product={product} setProduct={setProduct} />
        </>
    );
}

export default UProduct;
