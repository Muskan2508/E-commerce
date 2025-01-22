import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from'../../assets/cross_icon.png'
const ListProduct = () => {
  const [allproducts,setAllProducts]=useState([]);
  const fetchInfo=async()=>{
    await fetch('http://localhost:4000/allproducts')
    //This is called when the first Promise (from fetch()) is resolved successfully.
    //res represents the response returned by the server.
    //res.json() is called to parse the response body as JSON. This also returns a Promise, which will be resolved to the actual JSON data.
    .then((res)=>res.json())
    //setAllProducts(data) is called to update the allproducts state with the fetched data.
    .then((data)=>{setAllProducts(data)});
  }
  useEffect(()=>{
    fetchInfo();
  },[])//added a square bracket as we want this function to be executed only once

  const remove_product=async (id)=>{
    await fetch('http://localhost:4000/removeproduct' ,{
      method:'post',//POST request is typically used for sending data to the server to create or update a resource
      headers:{//specifies the headers that will be included in the request. Headers provide additional information about the request, such as the type of data being sent or accepted.
        Accept:'application/json',//This header tells the server that the client (the frontend) expects the response data to be in JSON format. This is helpful in ensuring that the server responds with JSON instead of plain text or other formats
        'Content-type':'application/json',
      },
      body:JSON.stringify({id:id})//This header indicates that the body of the request contains JSON data. When sending data to the server (like the product ID in this case), you need to tell the server how to interpret the body, which is JSON in this case.
    })
    await fetchInfo();
  }
  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          return <><div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className='listproduct-product-icon'/>
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}}className='listproduct-remove-icon' src={cross_icon} alt="" />
          </div>
          <hr />
          </>//this tag makes aline after all product
        })}
      </div>
    </div>
  )
}

export default ListProduct
