// import React, { useContext } from 'react'
// import { Shopcontext } from '../Context/Shopcontext';
// import { useParams } from 'react-router-dom';
// import Breadcrum from '../Components/Breadcrums/Breadcrum';
// const Product = () => {
//   const {all_product}=useContext(Shopcontext);
//   const {productId}=useParams();
//   const product=all_product.find((e)=>e.id===Number(productId));
//   return (
//     <div>
//       <Breadcrum product={product}/>
//     </div>
//   )
// }

// export default Product

import React,{useContext} from 'react'
import { Shopcontext } from '../Context/Shopcontext';
import {useParams} from 'react-router-dom'
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

export default function Product() {
  const {all_product} = useContext(Shopcontext);
  const {productID} = useParams();   
  const product = all_product.find((e)=>e.id===Number(productID));  return (
    <div>
        <Breadcrum product={product}/>
        <ProductDisplay product={product}/>
        <DescriptionBox></DescriptionBox>
        <RelatedProducts/>
    </div>
  )
}

