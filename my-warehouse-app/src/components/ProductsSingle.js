import React from "react";
import Image from "next/image";

const ProductsSingle = ({ product }) => {
  return (
    <div className="bg-stone-200 rounded-lg p-4 shadow-md flex flex-col md:flex-row items-center md:items-start">
      <div className="relative w-full max-w-[300px] mx-auto md:mx-0 md:mr-6">
        <Image
          src={product.thumbnail_guid || "/product-placeholder.jpeg"}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-gray-900 text-2xl font-bold mt-4 md:mt-0">
          {product.name}
        </h2>
        <p className="text-lg font-semibold text-green-600">${product.price}</p>
        <p className="text-sm text-gray-600">Stock: {product.stock}</p>

        <button className="bg-green-500 text-black py-2 px-4 rounded mt-4 hover:bg-green-600">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductsSingle;
