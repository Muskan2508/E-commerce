import React, { useContext } from 'react';
import './CartItems.css';
import { Shopcontext } from '../../Context/Shopcontext';
import remove_icon from '../Assets/cart_cross_icon.png';
import toast from "react-hot-toast";

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, userData } = useContext(Shopcontext);
    const totalAmount =getTotalCartAmount();
    const handlePayment = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalAmount })
            });

            const data = await res.json();
            if (!data || !data.order) throw new Error("Payment order failed!");

            handlePaymentVerify(data.order);
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Payment initialization failed!");
        }
    };

    const handlePaymentVerify = async (data) => {
        if (!window.Razorpay) {
            toast.error("Razorpay SDK not loaded!");
            return;
        }
    
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Your Store",
            description: "Test Transaction",
            order_id: data.id,
            handler: async (response) => {
                try {
                    // Retrieve the token from localStorage (or sessionStorage)
                    const token = localStorage.getItem('auth-token'); // Make sure this is where the token is stored
    
                    if (!token) {
                        toast.error("Authentication token is missing!");
                        return;
                    }
                    console.log(response); 
                    // Include the token in the request headers
                    const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "auth-token": token // Add the auth-token to headers
                        },
                        body: JSON.stringify(response) // Pass the response data
                    });
    
                    const verifyData = await res.json();
                    if (verifyData.success) {
                        toast.success(verifyData.message);
                    } else {
                        toast.error("Payment verification failed!");
                    }
                } catch (error) {
                    console.error("Verification Error:", error);
                    toast.error("Payment verification failed!");
                }
            },
            theme: { color: "#5f63b8" }
        };
    
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };             

    return (
        <div className="cartitems">
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt={e.name} className="carticon-product-icon" />
                                <p>{e.name}</p>
                                <p>${e.new_price.toFixed(2)}</p>
                                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                                <p>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                                <img
                                    className="cartitems-remove-icon"
                                    src={remove_icon}
                                    onClick={() => removeFromCart(e.id)}
                                    alt="Remove"
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}

            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            {userData.coins >= 500 ? (
                                <>
                                    <h3 style={{ textDecoration: 'line-through', color: 'red' }}>
                                        ${(getTotalCartAmount() / 0.7).toFixed(2)}
                                    </h3>
                                    <h3>${getTotalCartAmount()}</h3>
                                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                                        🎉 30% Discount Applied!
                                    </p>
                                </>
                            ) : (
                                <h3>${getTotalCartAmount()}</h3>
                            )}
                        </div>
                    </div>
                    <button onClick={handlePayment}>PROCEED TO CHECKOUT</button>
                </div>

                <div>
                    <div className="cartitems-promocode">
                        <p>If you have a promo code, enter it here</p>
                        <div className="cartitems-promobox">
                            <input type="text" placeholder="Promo code" />
                            <button>Submit</button>
                        </div>
                    </div>

                    <div className="animated-box">
                        🎉 Earned 500 coins? Enjoy an exclusive <strong>30% OFF</strong> on your order – because loyalty pays off! 🛍💰
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
