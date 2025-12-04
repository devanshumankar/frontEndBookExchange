import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [errorLogin, setErrorLogin] = useState("");
    const [errorSignUp, setErrorSignUp] = useState("");

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL; // <-- use environment variable

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!userName) return setErrorSignUp("Please enter a username");
        if (!email) return setErrorSignUp("Please enter an email");
        if (!phone) return setErrorSignUp("Please enter a phone number");
        if (!password) return setErrorSignUp("Please enter a password");
        if (!/^\d{10}$/.test(phone.trim()))
            return setErrorSignUp("Phone number must be 10 digits");

        try {
            const UserCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = UserCred.user.uid;

            const res = await fetch(`${API_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, userName, email, phone, isVerified: false, role: "user" })
            });

            const data = await res.json();

            if (!res.ok) {
                return setErrorSignUp(data.error || "Please try again later");
            }

            setErrorSignUp("Thank You For Registering Please Login");

        } catch (err) {
            if (err.code === "auth/email-already-in-use")
                setErrorSignUp("Email is already registered");
            else if (err.code === "auth/invalid-email")
                setErrorSignUp("Email format is invalid");
            else if (err.code === "auth/missing-password")
                setErrorSignUp("Password field was empty");
            else if (err.code === "auth/weak-password")
                setErrorSignUp("Password must be at least 6 characters");
            else setErrorSignUp("Please try again later");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorLogin("");

        if (!loginEmail) return setErrorLogin("Please enter an email");
        if (!loginPassword) return setErrorLogin("Please enter a password");

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const uid = auth.currentUser.uid;

            const user = await fetch(`${API_URL}/api/user/${uid}`);
            const data = await user.json();

            if (!user.ok) return setErrorLogin(data.error || "User not found");

            if (!data.isVerified) {
                return setErrorLogin("Your account is not verified. Please contact admin.");
            }
            if (data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }

        } catch (err) {
            if (err.code === "auth/invalid-email") setErrorLogin("Invalid email");
            else if (err.code === "auth/user-not-found") setErrorLogin("No user exists with this email");
            else if (err.code === "auth/wrong-password") setErrorLogin("Password is incorrect");
            else if (err.code === "auth/invalid-credential") setErrorLogin("Email/password combination is wrong");
            else setErrorLogin("Please try again later");
        }
    };

    return (
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />

            <div className="signup">
                <form onSubmit={handleSignUp}>
                    <label htmlFor="chk" aria-hidden="true">
                        Sign up
                    </label>

                    <input
                        type="text"
                        placeholder="User name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="error-box">{errorSignUp}</div>

                    <button type="submit">Sign up</button>
                </form>
            </div>

            <div className="login">
                <form onSubmit={handleLogin}>
                    <label htmlFor="chk" aria-hidden="true">
                        Login
                    </label>

                    <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />

                    <div className="error-box">{errorLogin}</div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
