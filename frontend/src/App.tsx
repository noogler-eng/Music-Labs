import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Stream from "./pages/Stream";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../store/user/userAtom";
import axios from "axios";

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  console.log(user);

  const handleUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/getUser`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      const userData = res.data.user;
      setUser({
        id: userData.id,
        name: userData.name,
        imageUrl: userData.imageUrl,
        loading: false,
      });
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  useEffect(() => {
    handleUserData();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/streams/:id" element={<Stream />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
