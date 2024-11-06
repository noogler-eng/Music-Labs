import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Button } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";

export default function Navbar() {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between px-4 py-4 items-center">
      <div className="text-3xl">Music-Labs</div>
      <div className="flex gap-3 items-center">
        <Link to={"/about"} className="hover:text-red-500">
          /About
        </Link>

        {user && user.imageUrl && (
          <Avatar isBordered color="success" src={user.imageUrl} />
        )}
        {user ? (
          <Button color="default">Logout</Button>
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
