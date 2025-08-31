"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./db/prisma"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpData = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string(),
    password: zod_1.default.string(),
    image: zod_1.default.string(),
});
const signInData = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string(),
});
const authRouter = express_1.default.Router();
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield req.body;
    try {
        const isValidIncommingData = signUpData.safeParse(body);
        if (!isValidIncommingData.success) {
            res.status(401).json({
                msg: "Invalid Data",
            });
            return;
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: isValidIncommingData.data.email,
            },
        });
        if (user) {
            res.status(401).json({
                msg: "user already exists",
            });
            return;
        }
        // clodinary will be used to generate the image url by storing and labelling them to
        // their buyed domains
        const new_user = yield prisma_1.default.user.create({
            data: {
                name: isValidIncommingData.data.name,
                email: isValidIncommingData.data.email,
                imageUrl: isValidIncommingData.data.image,
                password: yield bcrypt_1.default.hash(isValidIncommingData.data.password, 10),
            },
        });
        res.status(201).json({
            msg: "user created",
            id: new_user === null || new_user === void 0 ? void 0 : new_user.id,
        });
    }
    catch (error) {
        console.log("error while singup: ", error);
        res.status(401).json({
            msg: "Invalid Data",
        });
    }
}));
authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield req.body;
    try {
        const isValidInCommingData = signInData.safeParse(body);
        if (!isValidInCommingData.success) {
            res.status(401).json({
                msg: "Invalid Data",
            });
            return;
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: isValidInCommingData.data.email,
            },
        });
        if (!user) {
            res.status(401).json({
                msg: "user not exits",
            });
            return;
        }
        const isPasswordMatched = bcrypt_1.default.compare(isValidInCommingData.data.password, user.password);
        if (!isPasswordMatched) {
            res.status(401).json({
                msg: "Incorrect Password",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email }, "sharad", {
            expiresIn: "5h",
        });
        res.status(200).json({
            msg: "singin successfully",
            token: token,
        });
    }
    catch (error) {
        console.log("error while signin: ", error);
    }
}));
// simply it will getUser and store them in recoil state varibale
// it will decode the obtained
authRouter.get("/getUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield req.headers.authorization;
    try {
        const dataDecoded = yield jsonwebtoken_1.default.verify(token.split(" ")[1], "sharad");
        const user = yield prisma_1.default.user.findUnique({
            where: {
                // @ts-ignore
                email: dataDecoded.email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                imageUrl: true,
            },
        });
        res.status(200).json({
            msg: "singin successfully",
            user: user,
        });
    }
    catch (error) {
        console.log("error while signin: ", error);
    }
}));
exports.default = authRouter;
