// import React, { createContext } from 'react'
// import all_product from '../Components/Assets/all_product';

// export const Shopcontext=createContext({});
// const ShopcontextProvider=(props)=>{
//     const contextValue={all_product};
//     return (
//         <Shopcontext.Provider value={contextValue}>
//             {props.children}
//         </Shopcontext.Provider>
//     )
// }
// export default ShopcontextProvider; 
// This code sets up a React Context for sharing data (all_product) across multiple components in your React application
//  without having to pass props manually through every level of the component tree.
// Any component that needs access to the all_product data can easily consume it via the context.


import React ,{createContext, useEffect, useState} from "react";
// import all_product from '../Components/Assets/all_product';

export const Shopcontext= createContext({});
const getDefaultCart=()=>{
    let cart={};
    // for (let index = 0; index < all_product.length; index++) {
        for (let index = 0; index < 300+1; index++) {
        cart[index]=0;
        
    }return cart;
}
const ShopcontextProvider = (props) => {
    const [all_product,setAll_product]=useState([]);
    const [cartItems,setCartItems]=useState(getDefaultCart());
    //we are fetching products from allproduct api
    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_product(data))

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setCartItems(data); // Update state with fetched cart data
                }
            })
            .catch((error) => console.error('Error fetching cart:', error));
        }
    },[])
    // console.log(cartItems);
    const addToCart=(ItemId)=>{
        setCartItems((prev)=>({...prev,[ItemId]:prev[ItemId]+1}))
        // console.log(cartItems);
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },body:JSON.stringify({"ItemId":ItemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    // { ...prev } creates a shallow copy of the current cartItems state to maintain immutability (a best practice in React).
    // [ItemId]: prev[ItemId] + 1 increments the quantity of the item with the given ItemId.
    // prev[ItemId] retrieves the current quantity of the item in the cart.
    // +1 increases that quantity by 1.
    const removeFromCart=(ItemId)=>{
        setCartItems((prev)=>({...prev,[ItemId]:prev[ItemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },body:JSON.stringify({"ItemId":ItemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=all_product.find((product)=>product.id===Number(item))
                totalAmount+=itemInfo.new_price * cartItems[item];
            }
        }return totalAmount;
    }
    const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
        if (cartItems[item] > 0) {
            totalItem += cartItems[item];
        }
    }
    return totalItem;
    }

    const contextValue= {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <Shopcontext.Provider value={contextValue}>
            {props.children}
        </Shopcontext.Provider>
    )
}

export default ShopcontextProvider;


