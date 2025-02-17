import React, { useState } from 'react';
import './AddNGO.css';

const AddNGO = () => {
    const [ngoDetails, setNgoDetails] = useState({
        name: "",
        url: "",
    });

    const changeHandle = (e) => {
        setNgoDetails({ ...ngoDetails, [e.target.name]: e.target.value });
    };

    const addNGO = async (e) => {
        e.preventDefault();
        console.log("NGO Details Submitted:", ngoDetails);

        try {
            const response = await fetch("http://localhost:4000/addngo", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ngoDetails),
            });

            const data = await response.json();
            data.success ? alert("NGO added") : alert("Failed");
        } catch (error) {
            console.error("Error adding NGO:", error);
            alert("An error occurred while adding the NGO.");
        }
    };

    return (
        <div className="form-container">
            <form className="forms">
                <label className="ls" htmlFor="ngo-name">NGO Name:</label>
                <input className="ints" value={ngoDetails.name} onChange={changeHandle} type="text" id="ngo-name" name="name" required />
                <br />
                <label className="ls" htmlFor="ngo-url">NGO URL:</label>
                <input className="ints" value={ngoDetails.url} onChange={changeHandle} type="url" id="ngo-url" name="url" required />
                <br />
                <button className="btns" type="submit" onClick={addNGO}>Submit</button>
            </form>
        </div>
    );
};

export default AddNGO;