import './SignUp.css';
import TextField from '@mui/material/TextField';
import log from './assets/log.jpg'
import name1 from './assets/name.jpg'
import signUpImg from './assets/signUpImg.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUp() {
    let [email, setEmail] = useState("");
    let [pass, setPass] = useState(""); 
    let [err, setErr] = useState("");

    let handelChange = (event) => {
        const {id, value} = event.target;
        if (id === "email") {
            setEmail(value);
        } else if (id==="password") {
            setPass(value);
        }
    }

    let handelSignUp = async(event)=> {
        event.preventDefault();
        console.log(`email is  ${email}`);
        console.log(`password is  ${pass}`);
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            navigate("/");
        } catch (err) {
            setErr(err.message);
        };
        console.log(`email is  ${email}`);
        console.log(`password is  ${pass}`);
    }




    const navigate = useNavigate();
     function handelClick  () {
        navigate('/')
    }

    return (
        <div className="signUp">
            <div className="s-box">
                <img 
                    src={signUpImg}
                    alt="Sign Up illustration" 
                />
            </div>
            <div className="s-box1">
                
                <div className="logoInfo">
                    <img src={log} alt="Logo" />
                    <div className="todoNameBox">
                        <h1>MANAGE BUDDY</h1>
                        <p style={{marginTop:"-5px"}}>MANAGE LIFE,SMATER </p>
                    </div>
                </div>
                <div className="formBox">
                    <form onSubmit={handelSignUp}>
                    <h1>Create Account</h1>
                        <p>Please fill in your details</p>
                        <div className="element">
                            <TextField
                                onChange={handelChange} 
                                fullWidth
                                value={email}
                                id="email"
                                label="Email"
                                type="email"
                                variant="outlined"
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
                            onChange={handelChange}
                                fullWidth
                                value={pass}
                                id="password"
                                label="Password"
                                type="password"
                                autoComplete="off"
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Cutive mono",
                                        fontSize: "1.1rem"
                                    }
                                }} 
                            />
                        </div>
                        <button type="submit" className="element s-signUpButton">Create Account</button>
                    </form>
                </div>
                <div className=" element s-logIn">
                    <p>Already have an account?</p>
                    &nbsp;
                    <button onClick={handelClick} id='s-logInButton'>Log in</button>
                </div>
            </div>
        </div>
    );
}
