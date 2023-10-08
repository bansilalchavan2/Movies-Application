import { Router } from "express";
import { prisma } from "./db/prisma";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { auth } from "./middleware/auth";
export const routes = Router();
dotenv.config();

//Create movie
routes.post("/createMovie", auth, async (req, res) => {
  try {
    const { userId, name, cast, genre, rating } = req.body;

    await prisma.movie.create({
      data: {
        name: name,
        cast: cast,
        genre: genre,
        rating: rating,
      },
    });
    res.status(200).json({
      status: 201,
      success: true,
      message: " Movie created Successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

//Update movie
routes.patch("/updateMovie/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json({
      status: 204,
      success: true,
      id: id,
      message: " Movie updated Successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

//Get movie
routes.get("/getMovie/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: " Movie retrieved Successfully",
      movie: movie,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

//Get all movie
routes.get("/getAllMovie", auth, async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.status(200).json({
      status: 200,
      success: true,
      message: " Movie listed Successfully",
      totalCount: movies.length,
      moviesList: movies,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

//Delete movie
routes.delete("/deleteMovie/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      status: 204,
      success: true,
      message: " Movie deleted Successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

//Register user
routes.post("/register", async (req, res) => {
  //let saltRounds = 8;
  //let encryptedPassword =await bcrypt.hash(req.body['password'], saltRounds);
  try {
    const { name, email, password } = req.body;

    const isUserEmailExist = await prisma.user.findUnique({
      where: { email: email },
    });
    if (isUserEmailExist) {
      res.status(404).json({
        status: 404,
        success: false,
        message: "User email already exist",
      });
      return;
    }
    let salt = 8;
    let encryptedPassword = await bcrypt.hash(password, salt);
    let result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: encryptedPassword,
      },
    });

    res.status(200).json({
      status: 201,
      success: true,
      message: " User created Successfully",
      user: result,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});

// login user
routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!isUserExist) {
      res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
      return;
    }
    const isPasswordMatched = bcrypt.compareSync(
      password,
      isUserExist?.password
    );
    if (!isPasswordMatched) {
      res.status(400).json({
        status: 400,
        success: false,
        message: "wrong password",
      });
      return;
    }
    const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "";
    const token = jwt.sign(
      { _id: isUserExist?.id, email: isUserExist?.email },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "login success",
      token: token,
      id: isUserExist.id,
      email: isUserExist.email,
      name: isUserExist.name,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
});
