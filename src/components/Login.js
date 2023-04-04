import { useState} from "react";
import FaunaClient from "../Faunadoo";
import "../styling/Login.css";
import Signup from "./Signup";

export default function Login(props) {
    const db = new FaunaClient(process.env.REACT_APP_FAUNA_KEY);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [displaySignupForm, setDisplaySignupForm] = useState(false);

    const usernameHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const signinHandler = (e) => {
        e.preventDefault();            
        db.query(`Login("${username}","${password}")`).then(result => {
            if(!result) {
                setInvalidPassword(true);
            } else {
                const userInfo = {
                    username: result.document.name,
                    id: result.document.id,
                    key: result.secret
                }
                window.localStorage.setItem("todo-loggedInUser", JSON.stringify(userInfo));
                window.location.href = "/";
                props.confirmLogin(false);
            }
        }).catch(error => {console.log(error)})
    }

    const signupFormDisplayHandler = (e) => {
        e.preventDefault();
        setDisplaySignupForm(!displaySignupForm);
    }

    const displayLogin = (response) => {
        setDisplaySignupForm(response);
    }

    return(
        <div className="loginFormWrap">
            {!displaySignupForm ? ( 
                <>            
                    <form className="formWrapper" onSubmit={signinHandler}>
                        <h2>Sign-In</h2>
                        <div className="container">
                            <label>Username</label>
                            <input className="loginInput" onChange={usernameHandler} required value={username}/>      
                        </div>

                        <div className="container">
                            <label>Password</label>
                            <input  className="loginInput" type="password" onChange={passwordHandler} required value={password}/>
                            {invalidPassword ? (<div className="redFontText">Username or password is incorrect</div>) : null}
                        </div>

                        <button className="btn" type="submit">sign-in</button>
                    </form>

                    <button className="btn" onClick={signupFormDisplayHandler}>don't have an account?</button>
                </>           
            ) : (
                <Signup displayLogin={displayLogin}/>
            )}

        </div>
    )
}