import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';

const CartContent = () => {
    const cartProducts = [
        {
            productId: 1,
            name: "T-shirt",
            size: "M",
            color: "Red",
            quantity: 1,
            price: 15,
            image: "https://picsum.photos/200?random=1",
        },
        {
            productId: 2,
            name: "Jeans",
            size: "L",
            color: "Blue",
            quantity: 1,
            price: 25,
            image: "https://picsum.photos/200?random=2",
        },
        {
            productId: 3,
            name: "Shirt",
            size: "S",
            color: "Yellow",
            quantity: 5,
            price: 20,
            image: "https://picsum.photos/200?random=3",
        },
        {
            productId: 4,
            name: "Shirt",
            size: "S",
            color: "Yellow",
            quantity: 4,
            price: 20,
            image: "https://picsum.photos/200?random=4",
        },
        {
            productId: 5,
            name: "Sweat-Shirt",
            size: "M",
            color: "Green",
            quantity: 10,
            price: 10,
            image: "https://picsum.photos/200?random=8",
        },

    ];

    return <div>
        {
            cartProducts.map((product, index) => (
                <div key={index} className="flex items-start justify-between py-4 border-b">
                    <div className="flex items-start">
                        <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded" />
                        <div>
                            <h3>{product.name}</h3>
                            <p className="text-sm text-gray-500">
                                size: {product.size} | color: {product.color}
                            </p>
                            <div className="flex items-center mt-2">
                                <button className="border rounded px-2 text-xl font-medium">-</button>
                                <span className="mx-4">{product.quantity}</span>
                                <button className="border rounded px-2 text-xl font-medium">+</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="font-medium">$ {product.price.toLocaleString()}</p>
                        <button>
                            <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                        </button>
                    </div>
                </div>
            ))
        }
    </div>
}

export default CartContent; 