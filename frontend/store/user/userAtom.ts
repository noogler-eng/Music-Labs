import { atom } from "recoil";
const userAtom = atom<{
  id: string;
  name: string;
  imageUrl: string | null;
} | null>({
  key: "userAtom",
  default: null,
});

export default userAtom;