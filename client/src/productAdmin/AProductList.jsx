import AProductItem from "./AProductItem";

function AProductList({ product = [], setProduct }) {
    return (
        <div id="container">
            {product.length > 0 ? product.map(prod => (
                <AProductItem 
                    key={prod.id}
                    id={prod.id}
                    name={prod.name}
                    description={prod.description}
                    price={prod.price}
                    image={prod.image}
                    stock={prod.stock}
                    product={product} 
                    setProduct={setProduct}
                />
            )) : <p>No products available</p>}
        </div>
    );
}

export default AProductList;
