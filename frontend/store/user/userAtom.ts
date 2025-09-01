import { atom } from "recoil";
const userAtom = atom<{
  id: string;
  name: string;
  imageUrl: string | null;
  loading: boolean;
} | null>({
  key: "userAtom",
  default: {
    id: "",
    name: "",
    imageUrl: null,
    loading: true,
  },
});

export default userAtom;
