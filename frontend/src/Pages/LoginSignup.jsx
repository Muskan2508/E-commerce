import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {
  const [state,setState]=useState("Login");
  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })
  // to get the data from the input field we'll use changeHandler func
  const changeHandler=(e)=>{
    //e.target.name: This refers to the name attribute of the input field that triggered the change event (e.g., username, password, or email).
    //e.target.value: This is the value that the user typed in the input field. It holds the updated value of the input.
    //The ...formData is the spread operator. It creates a shallow copy of the current formData object. 
    // This ensures that all the existing properties (e.g., username, password, email) in the state are kept intact when the new value is added or updated.
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const login=async ()=>{
    console.log("Login function executed",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }else{
      alert(responseData.errors);
    }
  }
  const signup=async ()=>{
    console.log("Signup function executed",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/");
    }else{
      alert(responseData.errors);
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {/* the changeHandler function that will be called every time the user types in the input field. The changeHandler function will update the formData state with the new value. */}
          {/* value field:- This binds the input field's value to the username property in the formData state. This makes it a controlled component because its value is controlled by React's state. */}
          {state==="Sign Up"?<input name='username' value={formData.username}onChange={changeHandler} type="text" placeholder='Name'/>:<></>}
          <input name='email' value={formData.email}onChange={changeHandler} type="email" placeholder='Email Address'/>
          <input name='password' value={formData.password}onChange={changeHandler} type="password" placeholder='Password'/>
          
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up" ?<p className="loginsignup-login">Already have an acount?<span onClick={()=>{setState("Login")}}>Login here</span></p>
        :<p className="loginsignup-login">Create an acount?<span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
        
        
        <div className="loginsignup-agree">
        <input type="checkbox"name='' id='' />
        <p>By continuing,I agree to the Terms of Use & privacy policy</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
