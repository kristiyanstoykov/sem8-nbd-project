import React from "react";

const ProductPage = () => {
  // Dummy product data
  const product = {
    id: id,
    name: "Sample Product",
    description: "This is a sample product description.",
    price: "$99.99",
  };

  return (
    <div>
      <h1>Product Details</h1>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
};

export default ProductPage;
