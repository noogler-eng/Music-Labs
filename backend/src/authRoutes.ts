import express from "express";
import prisma from "./db/prisma";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const signUpData = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
  image: zod.string(),
});

const signInData = zod.object({
  email: zod.string(),
  password: zod.string(),
});

const authRouter = express.Router();
authRouter.post("/signup", async (req: any, res: any) => {
  const body: any = await req.body;
  try {
    const isValidIncommingData = signUpData.safeParse(body);
    if (!isValidIncommingData.success) {
      res.status(401).json({
        msg: "Invalid Data",
      });
      return;
    }

    const user = await prisma.user.findUnique({
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
    const new_user = await prisma.user.create({
      data: {
        name: isValidIncommingData.data.name,
        email: isValidIncommingData.data.email,
        imageUrl: isValidIncommingData.data.image,
        password: await bcrypt.hash(isValidIncommingData.data.password, 10),
      },
    });

    res.status(201).json({
      msg: "user created",
      id: new_user?.id,
    });
  } catch (error) {
    console.log("error while singup: ", error);
    res.status(401).json({
      msg: "Invalid Data",
    });
  }
});

authRouter.post("/signin", async (req: any, res: any) => {
  const body = await req.body;
  try {
    const isValidInCommingData = signInData.safeParse(body);
    if (!isValidInCommingData.success) {
      res.status(401).json({
        msg: "Invalid Data",
      });
      return;
    }

    const user = await prisma.user.findUnique({
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

    const isPasswordMatched = bcrypt.compare(
      isValidInCommingData.data.password,
      user.password
    );
    if (!isPasswordMatched) {
      res.status(401).json({
        msg: "Incorrect Password",
      });
      return;
    }

    const token = jwt.sign({ email: user.email }, "sharad", {
      expiresIn: "5h",
    });
    res.status(200).json({
      msg: "singin successfully",
      token: token,
    });
  } catch (error) {
    console.log("error while signin: ", error);
  }
});

// simply it will getUser and store them in recoil state varibale
// it will decode the obtained
authRouter.get("/getUser", async (req: any, res: any) => {
  const token: any = await req.headers.authorization;
  try {
    const dataDecoded: JwtPayload | string = await jwt.verify(token.split(" ")[1], "sharad");

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.log("error while signin: ", error);
  }
});

export default authRouter;
