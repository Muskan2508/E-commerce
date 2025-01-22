import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>

        </div>
        <div className="descriptionbox-description">
          <p>E-commerce, or electronic commerce, is the buying and selling of products and services online.
             It can take place on any digital device or platform, such as a smartphone, online store, or social media platform</p>
          <p>E-commerce platforms provide a seamless shopping experience, integrating secure payment systems, 
            personalized recommendations, and fast delivery options to meet modern consumer demands.</p>
        </div>
    </div>
  )
}

export default DescriptionBox
