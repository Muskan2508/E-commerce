import React, { useContext, useState,useRef,useEffect } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import coins from '../Assets/coins.jpeg'
import { Link } from 'react-router-dom'
import { Shopcontext } from '../../Context/Shopcontext'
import  nav_dropdown from '../Assets/nav_dropdown.png'
//import { DonationContext } from '../../Context/DonationContext';

const Navbar = () => {
    const[menu,setMenu]=useState("shop")
    const {getTotalCartItems}=useContext(Shopcontext);
    const [userData, setUserData] = useState({
      coins: 0,
      donationCount: 0,
     });

    //const [count, setCount] = useState(0); 
    //const { donationCount } = useContext(DonationContext);  

    const fetchUserData = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
          console.log("User is not authenticated.");
          return;
      }

      try {
          const response = await fetch("http://localhost:4000/getuser", {
              method: "GET",
              headers: {
                  "auth-token": token,
                  "Content-Type": "application/json",
              },
          });

          const data = await response.json();
          console.log("API Response:", data); // Debugging

          if (data.success) {
              setUserData({
                  coins: data.coins || 0,
                  donationCount: data.donationCount || 0,
              });
          } else {
              console.error("Failed to fetch user data:", data.errors);
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
  };

  // Fetch user data when Navbar loads
  useEffect(() => {
    fetchUserData();
}, []); // Runs only on component mount


    const menuRef=useRef();
    const dropdown_toggle=(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    // console.log("Testing getTotalCartItems:", getTotalCartItems());
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo}alt="" />
        <p>Shopper</p>

      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration:'none'}} to='/men'>Men</Link>{menu==="men"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration:'none'}}  to='/women'>Women</Link>{menu==="women"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        
      </ul>
      
      <div className='nav-coin'>
          <p>{userData.coins}</p>
        <img className="coin"src={coins} alt="" />
      </div>


      <div className="nav-login-cart">
        {/* The given code snippet renders a navigation section where the user sees either a Login button or a Logout button, depending on whether the user is authenticated (i.e., whether an authentication token exists in localStorage). */}
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
        :<Link to='/login'><button>Login</button></Link>}
        
        <Link to='/cart'><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar
