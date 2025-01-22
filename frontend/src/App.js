

// import './App.css';
// import Navbar from './Components/Navbar/Navbar';
// import Shop from './Pages/Shop';
// import Shopcategory from './Pages/Shopcategory';
// import Product from './Pages/Product';
// import Cart from './Pages/Cart';
// import LoginSignup from './Pages/LoginSignup';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Footer from './Components/Footer/Footer'
// import men_banner from './Components/Assets/banner_mens.png'
// import women_banner from './Components/Assets/banner_women.png'
// import kid_banner from './Components/Assets/banner_kids.png'
// import ShopcontextProvider from './Context/Shopcontext';
// function App() {
//   return (
//     <div>
//       <Router>
//         {/* <ShopcontextProvider> */}
//           <Navbar />
        
//         <Routes>
//           <Route exact path="/" element={<Shop/>} />
//           <Route exact path="/men" element={<ShopcontextProvider><Shopcategory banner={men_banner} category="men" /></ShopcontextProvider>} />
//           <Route exact path="/women" element={<ShopcontextProvider><Shopcategory banner={women_banner} category="women" /></ShopcontextProvider>} />
//           <Route exact path="/kids" element={<ShopcontextProvider><Shopcategory banner={kid_banner} category="kid" /></ShopcontextProvider>} />
//           <Route exact path="/product/:productID" element={<ShopcontextProvider><Product /></ShopcontextProvider>} />
//           <Route exact path="/cart" element={<ShopcontextProvider><Cart /></ShopcontextProvider>} />
//           <Route exact path="/login" element={<LoginSignup />} />
//         </Routes>
//         <Footer/>
//         {/* </ShopcontextProvider> */}
//       </Router>
//     </div>
//   );
// }

// export default App;

import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import Shopcategory from './Pages/Shopcategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import ShopcontextProvider from './Context/Shopcontext';

function App() {
  return (
    <ShopcontextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Shop />} />
          <Route exact path="/men" element={<Shopcategory banner={men_banner} category="men" />} />
          <Route exact path="/women" element={<Shopcategory banner={women_banner} category="women" />} />
          <Route exact path="/kids" element={<Shopcategory banner={kid_banner} category="kid" />} />
          <Route exact path="/product/:productID" element={<Product />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/login" element={<LoginSignup />} />
        </Routes>
        <Footer />
      </Router>
    </ShopcontextProvider>
  );
}

export default App;
