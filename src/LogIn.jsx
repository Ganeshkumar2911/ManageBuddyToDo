import './LogIn.css';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react"
import log from './assets/log.jpg'
import logInImg from './assets/logInImg.jpg'
import SignUp from './SignUp';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import { auth,db } from "./firebase"
import {doc, getDoc, setDoc} from "firebase/firestore";

export default function LogIn({setUserEmail}) {

    const navigate = useNavigate();
    function handelClick() {
        navigate('/signUp');
    }

    const[email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[err, setErr] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
    

    const handelLogIn = async (event) => {
        event.preventDefault();
        if(!isValidEmail(email)) {
            alert("Enter a valid email address");
            setEmail("");
            setPassword("");
            return;
          }
        try{
            await signInWithEmailAndPassword(auth, email, password);
            console.log(`email is  ${email}`);
            localStorage.setItem("userEmail",email);
            setUserEmail(email);
            setIsLoggedIn(true);
        } catch(err) {
            alert("Enter a valid password")
            // setErr(err.message);
        }
    };

    useEffect(()=> {
        if(isLoggedIn) {
            navigate("/Todo");
        }
    },[isLoggedIn,navigate]);

    let handelChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    
    
    const handleForgotPassword = async () => {
        if (!email) {
          setMessage("Enter your email first");
          return;
        }
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Password reset link sent! Check your email.");
        } catch (err) {
          alert("Failed to send reset email. Check your email.");
        }
      };
    

    return (
        <div className="logIn">
            {err && <p style={{color: "red"}}>{error1}</p>}

            <div className="box1">
                <div className="logoInfo">
                    <img src={log} alt="Logo" />
                    <div className="todoNameBox">
                        <h1>MANAGE BUDDY</h1>
                        <p style={{marginTop:"-5px"}}>MANAGE LIFE,SMATER </p>
                    </div>
                </div>
                <div className="formBox">
                    <form onSubmit={ handelLogIn }>
                        <h1>Welcome</h1>
                        <p>Please enter your details</p>
                        <div className="elementInput">
                            <label htmlFor="email">User Email</label>
                            <input
                                name="email"
                                type='email'
                                placeholder='Enter your email'
                                onChange={handelChange} 
                                // style={{width: "100%", color:"black"}} 
                                variant="outlined"
                                value={email}
                                required
                                autoComplete='off'
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Cutive mono",
                                        fontSize: "1.1rem"
                                    }
                                }} 
                            />
                        </div>
                        <div className="elementInput">
                            <label>Password</label>
                            <input
                                name="password"
                                placeholder="Enter Password"
                                onChange={handelChange}
                                value={password}
                                style={{width: "100%", fontFamily: "Cutive mono"}}
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Cutive mono",
                                        fontSize: "1.1rem"
                                    }
                                }}
                            />
                        </div>
                        <div className="forgot element"><button style={{cursor:"pointer"}}onClick={handleForgotPassword} id='forgot' >Forgot Password ?</button></div>
                        <button type="submit" className=" element logInButton">Log in</button>
                    </form>
                </div >
                <div className="signIn element">
                <p>Don't have an account ?</p>
                &nbsp;
                <button onClick={handelClick} id='signInButton'>SignUp</button>
                </div>
            </div>
            
            <div className="box">
                <img src={logInImg} />
            </div>

        </div>
    );
}