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
    const API_URL = import.meta.env.VITE_API_URL;

    // ---------------- SIGN UP ----------------
    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorSignUp("");

        if (!userName || !email || !phone || !password) {
            return setErrorSignUp("All fields are required");
        }
        if (!/^\d{10}$/.test(phone.trim()))
            return setErrorSignUp("Phone number must be 10 digits");

        try {
            // 1️⃣ Create user in Firebase
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            // 2️⃣ Create user in backend
            const res = await fetch(`${API_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid,
                    userName,
                    email,
                    phone,
                    isVerified: false,
                    role: "user"
                })
            });

            const data = await res.json();

            if (!res.ok) return setErrorSignUp(data.error || "Backend registration failed");

            setErrorSignUp("Registered successfully! Please login.");

            // Clear form
            setUserName(""); setEmail(""); setPhone(""); setPassword("");

        } catch (err) {
            console.log(err);
            if (err.code === "auth/email-already-in-use")
                setErrorSignUp("Email already registered");
            else if (err.code === "auth/invalid-email")
                setErrorSignUp("Invalid email format");
            else if (err.code === "auth/weak-password")
                setErrorSignUp("Password must be at least 6 characters");
            else
                setErrorSignUp("Something went wrong. Try again later");
        }
    };

    // ---------------- LOGIN ----------------
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorLogin("");

        if (!loginEmail || !loginPassword) return setErrorLogin("All fields are required");

        try {
            // 1️⃣ Login via Firebase
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const uid = auth.currentUser.uid;

            // 2️⃣ Check backend for user
            let userRes = await fetch(`${API_URL}/api/user/${uid}`);
            let userData = await userRes.json();

            // 3️⃣ If user not in backend, create automatically
            if (!userRes.ok) {
                const createRes = await fetch(`${API_URL}/api/user/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid,
                        userName: auth.currentUser.displayName || "User",
                        email: auth.currentUser.email,
                        phone: "",
                        isVerified: false,
                        role: "user"
                    })
                });
                const createData = await createRes.json();
                if (!createRes.ok) return setErrorLogin(createData.error || "Failed to create backend user");
                userData = createData;
            }

            // 4️⃣ Verification and navigation
            if (!userData.isVerified) {
                return setErrorLogin("Your account is not verified. Please contact admin.");
            }
            if (userData.role === "admin") navigate("/admin");
            else navigate("/home");

        } catch (err) {
            console.log(err);
            if (err.code === "auth/invalid-email") setErrorLogin("Invalid email");
            else if (err.code === "auth/user-not-found") setErrorLogin("No user exists with this email");
            else if (err.code === "auth/wrong-password") setErrorLogin("Incorrect password");
            else setErrorLogin("Something went wrong. Try again later");
        }
    };

    return (
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />

            <div className="signup">
                <form onSubmit={handleSignUp}>
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
                    <input type="text" placeholder="User name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="error-box">{errorSignUp}</div>
                    <button type="submit">Sign up</button>
                </form>
            </div>

            <div className="login">
                <form onSubmit={handleLogin}>
                    <label htmlFor="chk" aria-hidden="true">Login</label>
                    <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <div className="error-box">{errorLogin}</div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
