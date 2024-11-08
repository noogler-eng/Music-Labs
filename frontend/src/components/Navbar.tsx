import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Button } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";

export default function Navbar() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between px-4 py-4 items-center">
      <div className="text-3xl">Music-Labs</div>
      <div className="flex gap-3 items-center">
        <Link to={"/about"} className="hover:underline text-sm underline">
          About
        </Link>
        <Link to={"/"} className="hover:underline text-sm underline">
          Home
        </Link>

        {user && user.imageUrl && (
          <Avatar isBordered color="success" src={user.imageUrl} />
        )}
        {user ? (
          <Button
            color="default"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            color="default"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
