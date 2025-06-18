import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Search from "./components/Search";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (email: string, name: string) => {
    try {
      const res = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        }
      );

      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      alert("An error occurred while logging in.");
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      {isLoggedIn ? <Search /> : <Login onLogin={handleLogin} />}
    </BrowserRouter>
  );
}

export default App;
