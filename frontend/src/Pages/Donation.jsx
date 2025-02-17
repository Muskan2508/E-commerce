import React, { useState, useContext, useEffect } from "react";
import "./CSS/Donation.css";
import { Shopcontext } from "../Context/Shopcontext";

const Donation = () => {
  const [rows, setRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHappen, setIsHappen] = useState(false);
  const [selectedNGOs, setSelectedNGOs] = useState(null);
  const [clothesDetails, setClothesDetails] = useState([]);
  const [NGOs, setNGOs] = useState([{name:"Any", url:"http//notfound"}]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    donationDate: "",
  });

  const [cloth, setCloth] = useState({
    type: "",
    quantity: "",
    damage: "",
    description: "",
  });



  useEffect(() => {
    const fetchNGOs = async () => {
        try {
            const response = await fetch('http://localhost:4000/allngos');
            if (!response.ok) throw new Error('Failed to fetch NGOs');

            const data = await response.json();
            if (data.success && Array.isArray(data.ngos)) {
                setNGOs(data.ngos);  // ✅ Fix: Ensure NGOs is an array
            } else {
                console.error("Invalid response format:", data);
                setNGOs([]);  // ✅ Fix: Set empty array on error
            }
        } catch (error) {
            console.error("Error fetching NGOs:", error);
            setNGOs([]);  // ✅ Fix: Prevent .map() errors
        }
    };

    fetchNGOs();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClothesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedClothes = [...clothesDetails];
    updatedClothes[index][name] = value;
    setClothesDetails(updatedClothes);
  };

  const handleNGOSelect = (ngo) => {
    setSelectedNGOs(ngo);
    setFormData({ ...formData, ngo: ngo.name });
  };

  const addRow = (e) => {
    if (e) e.preventDefault(); // Prevent default if event exists
    setClothesDetails([...clothesDetails, { type: "", quantity: "", damage: "", description: "" }]);
  };
  

  const removeRow = (index) => {
    setClothesDetails(clothesDetails.filter((_, i) => i !== index));
  };



  const [quantity, setQuantity] = useState(0);

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedNGOs) {
      alert("Please select an NGO before proceeding.");
      return;
    }
  
    if (clothesDetails.length === 0) {
      alert("Please add at least one clothing item.");
      return;
    }
  
    const formattedClothesDetails = clothesDetails.map(cloth => ({
      ...cloth,
      quantity: Number(cloth.quantity) || 0, // Convert to number
      damage: Number(cloth.damage) || 0, // Convert to number
    }));
  
    const donationData = {
      ...formData,
      clothesDetails: formattedClothesDetails,
      ngo: selectedNGOs.name, // Send only the NGO name
    };
  
    try {
      const response = await fetch("http://localhost:4000/donation", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const responseData = await response.json();
      if (responseData.success) {
        alert("Donation Successful! Thank you for your contribution.");
        window.location.replace("/");
      } else {
        alert(responseData.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      alert(`Failed to submit donation. ${error.message}`);
    }
  };
  
  
  
  // Fix setQuantities function
  const setQuantities = (e) => {
    let total = parseInt(e.target.value) || 0;
    setQuantity((prev) => prev + total);
  };
  
  return (
    <div className="container">
      <h1>Donate Now</h1>
      <form onSubmit={handleDonationSubmit}>
        <input className="inpt" value={formData.name} onChange={handleChange} type="text" name="name" placeholder="Your Name" required />
        <input className="inpt" value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Your Email" required />
        <input className="inpt" value={formData.phone} onChange={handleChange} type="number" name="phone" placeholder="Enter Phone number" required />
        <input className="inpt" value={formData.address} onChange={handleChange} type="text" name="address" placeholder="Your Address" required />
        <input className="inpt" value={formData.city} onChange={handleChange} type="text" name="city" placeholder="Your City" required />
        <input className="inpt" value={formData.pincode} onChange={handleChange} type="text" name="pincode" placeholder="Your Pincode" required />

        <p className="pp">Give details about the clothes you want to donate:</p>


        {clothesDetails.length ===0 && (
          <div className="helo">
          <button className="btn" type="button" onClick={ ()=>{ addRow();}}>Proceed</button>
          <hr/>
          </div>
        )}
        
        {clothesDetails.map((clothing, index) => (
          <div className="container-in" key={index}>
            <select className="inpt" name="type" value={clothing.type} onChange={(e) => handleClothesChange(index, e)} required>
              <option value="">Select Type</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Shirt">Shirt</option>
              <option value="Jeans">Jeans</option>
              <option value="Trouser">Trouser</option>
            </select>
            <input className="inpt" type="text" name="quantity" placeholder="Quantity" value={clothing.quantity || ""} onChange={(e) => {handleClothesChange(index, e); setQuantities(e);}} required />
            <input className="inpt" type="text" name="damage" placeholder="Damage Percentage" value={clothing.damage} onChange={(e) => handleClothesChange(index, e)} required />
            <textarea name="description" rows="1" cols="50" placeholder="Enter description..." value={clothing.description} onChange={(e) => handleClothesChange(index, e)}></textarea>
            <button className="btn" type="button" onClick={addRow}>ADD</button>
            <button className="btn" type="button" onClick={() => removeRow(index)}>X</button>
          </div>
        ))}

        {quantity>= 5 && (
          <button className="btn" type="button" onClick={() => setIsOpen(true)}>
            Proceed
          </button>
        )}


        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
              <h2>Preferred NGOs</h2>
              <div className="dropdown">
                <div className="dropdown-header" onClick={() => setIsHappen(!isHappen)}>
                  {selectedNGOs ? selectedNGOs.name : "Choose NGOs"}
                </div>
                {isHappen && (
                  <div className="dropdown-menu">
                     {NGOs.map((ngo, index) => (
                    <label key={index} className="ngo-option">
                      <input
                        type="radio"
                        name="ngo"
                        onChange={() => handleNGOSelect(ngo)}
                      />
                      <a href={ngo.url} target="_blank" rel="noopener noreferrer">{ngo.name}</a>
                    </label>
                  ))}

                  </div>
                )}
              </div>

              <label>Preferred Date for Donation:</label>
              <input className="inpts" type="date" name="donationDate" value={formData.donationDate} onChange={handleChange} required />
              <button className="donate-button" type="submit">Donate Now</button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default Donation;