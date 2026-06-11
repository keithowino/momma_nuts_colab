import UProductItem from "./UProductItem";

function UProductList({ product = [], setProduct }) {
    const colorPairs = [
            { nameColor: "#FF3CB0", descColor: "#4B1E0E", bgColor: "#FF3CB0" },
            { nameColor: "#F1531C", descColor: "#F7A720", bgColor: "#4B1E0E" },
            { nameColor: "#4B1E0E", descColor: "#FF3CB0", bgColor: "#4B1E0E" },
            { nameColor: "#F7A720", descColor: "#4B1E0E", bgColor: "#FFF8E1" },
            { nameColor: "#F7941D", descColor: "#F1531C", bgColor: "#FFEEDD" }
            ];

    return (
        <div id="container">
            {product.length > 0 ? product.map((prod, index) => {
                const { nameColor, descColor, bgColor } = colorPairs[index % colorPairs.length];

                return (
                    <UProductItem
                        key={prod.id}
                        id={prod.id} 
                        name={prod.name} 
                        description={prod.description}
                        price={prod.price}
                        image={prod.image}
                        stock={prod.stock}
                        product={product}
                        setProduct={setProduct}
                        nameColor={nameColor}
                        descColor={descColor}
                        bgColor={bgColor}
                    />
                );
            }) : <p>No products available</p>}
        </div>
    );
}

export default UProductList;
