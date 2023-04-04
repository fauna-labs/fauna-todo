import { useState} from "react";
import FaunaClient from "../Faunadoo";
import "../styling/Login.css";

export default function Signup(props) {
    const db = new FaunaClient(process.env.REACT_APP_FAUNA_KEY);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatingUsername, setRepeatingUsername] = useState(false);

    const usernameHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const signupHandler = (e) => {
        e.preventDefault();
        db.query(`User.byUsername("${username}")`).then(result => {
            if (result?.data.length > 0) {
                setRepeatingUsername(true);
            } else {
                db.query(
                `Signup("${username}", "${password}")`
                ).then( result => {
                    setUsername("");
                    setPassword("");
                    props.displayLogin(false);
                })
            }
        });
    }

    const redirectToSigninHandler = (e) => {
        e.preventDefault();
        props.displayLogin(false);
    }

    return (
        <>
            <form className="formWrapper" onSubmit={signupHandler}>
                <h2>Sign-Up</h2>
                <div className="container">
                    <label>Username</label>
                    <input className="input" onChange={usernameHandler} required/>
                    {repeatingUsername ? (<div className="redFontText">This username is already taken, pick another</div>) : null}         
                </div>

                <div className="container">
                    <label>Password</label>
                    <input  className="input" type="password" onChange={passwordHandler} required/>
                </div>

                <button className="btn" type="submit">sign-up</button>

                <div>
                    <button className="btn" onClick={redirectToSigninHandler}>sign-in</button>
                </div>
            </form>
        </>
    )
}