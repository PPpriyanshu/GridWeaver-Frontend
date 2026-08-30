import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login response:", response.data);

            // Save JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            setError("Invalid email or password");

        }
    };

    return (
        <div>

            <h1>GridWeaver Login</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>

            {error && (
                <p>{error}</p>
            )}

        </div>
    );
}

export default Login;