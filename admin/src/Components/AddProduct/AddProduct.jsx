import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
const AddProduct = () => {
    const [image,setImage]=useState(false);
    const[productDetails,setproductDetails]=useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })
    const imageHandler=(e)=>{
        setImage(e.target.files[0]);//Updates the image state with the selected file.
    }
    //... is a spread perator expands an iterable (like an array, string, or object) into individual elements.
    const changeHandler=(e)=>{
        setproductDetails({...productDetails,[e.target.name]:e.target.value});
    }
    const Add_Product=async()=>{
        console.log(productDetails);
        let responseData;
        let product=productDetails;

        let formData=new FormData();//A FormData object is created to encapsulate the image file (image).
        formData.append('product',image);

        await fetch('http://localhost:4000/upload', {
            method:'POST',
            headers:{
                Accept:'application/json',//Specifies that the client expects a JSON response.
               
            },
            body:formData,//The formData containing the image is sent to the server.
        }).then((resp)=>resp.json()).then((data)=>{responseData=data})

        if(responseData.success){
            product.image=responseData.image_url;
            console.log(product);
            //adding data to mongodb
            await fetch('http://localhost:4000/addproduct',{
                method:'post',
                headers:{
                    Accept:'application/json',
                    'Content-type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product added"):alert("Failed")
            })
        }
    }
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p> Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
        </div>
      </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                {/* If image contains a file (i.e., its truthy), URL.createObjectURL(image) generates a temporary URL for the uploaded file so it can be displayed in the browser. */}
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img'/>
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct

