

import './LogIn.css';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react"
import log from './assets/log.jpg'
import logInImg from './assets/logInImg.jpg'
import SignUp from './SignUp';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

    const handelLogIn = async (event) => {
        event.preventDefault();
        try{
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            console.log(`email is  ${email}`);
            localStorage.setItem("userEmail",email);
            setUserEmail(email);
            setIsLoggedIn(true);
            console.log(`password is  ${password}`);
            const user = userCred.user;
            const Useremail1 = user.email

            const userDocRef = doc(db, "user", userEmail1); // check for data
            const userDoc = await getDoc(userDocRef);

            if(!userDoc.exists()) {
                await setDoc(userDocRef, { project: []});
                localStorage.setItem("userEmail1",userEmail1);
            }


        } catch(err) {
            setErr(err.message);
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
    
    


    return (
        <div className="logIn">
            {err && <p style={{color: "red"}}>{err}</p>}

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
                        <div className="element">
                            <TextField
                                name="email"
                                onChange={handelChange} 
                                style={{width: "100%", color:"black"}}
                                id="email" 
                                label="User name" 
                                variant="outlined"
                                value={email}
                                required
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Cutive mono",
                                        fontSize: "1.1rem"
                                    }
                                }} 
                            />
                        </div>
                        <div className="element">
                            <TextField
                                name="password"
                                onChange={handelChange}
                                value={password}
                                style={{width: "100%", fontFamily: "Cutive mono"}}
                                id="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Cutive mono",
                                        fontSize: "1.1rem"
                                    }
                                }}
                            />
                        </div>
                        <div className="forgot element"><button id='forgot' >Forgot Password ?</button></div>
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