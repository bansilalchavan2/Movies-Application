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
exports.routes = void 0;
const express_1 = require("express");
const prisma_1 = require("./db/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./middleware/auth");
exports.routes = (0, express_1.Router)();
dotenv_1.default.config();
//Create movie
exports.routes.post("/createMovie", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, cast, genre, rating } = req.body;
        yield prisma_1.prisma.movie.create({
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
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
//Update movie
exports.routes.patch("/updateMovie/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.movie.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json({
            status: 204,
            success: true,
            id: id,
            message: " Movie updated Successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
//Get movie
exports.routes.get("/getMovie/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movie = yield prisma_1.prisma.movie.findUnique({
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
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
//Get all movie
exports.routes.get("/getAllMovie", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield prisma_1.prisma.movie.findMany();
        res.status(200).json({
            status: 200,
            success: true,
            message: " Movie listed Successfully",
            totalCount: movies.length,
            moviesList: movies,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
//Delete movie
exports.routes.delete("/deleteMovie/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.movie.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({
            status: 204,
            success: true,
            message: " Movie deleted Successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
//Register user
exports.routes.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //let saltRounds = 8;
    //let encryptedPassword =await bcrypt.hash(req.body['password'], saltRounds);
    try {
        const { name, email, password } = req.body;
        const isUserEmailExist = yield prisma_1.prisma.user.findUnique({
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
        let encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        let result = yield prisma_1.prisma.user.create({
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
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
// login user
exports.routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUserExist = yield prisma_1.prisma.user.findUnique({
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
        const isPasswordMatched = bcrypt_1.default.compareSync(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password);
        if (!isPasswordMatched) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "wrong password",
            });
            return;
        }
        const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : "";
        const token = jsonwebtoken_1.default.sign({ _id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id, email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email }, SECRET_KEY, {
            expiresIn: "1d",
        });
        res.status(200).json({
            status: 200,
            success: true,
            message: "login success",
            token: token,
            id: isUserExist.id,
            email: isUserExist.email,
            name: isUserExist.name,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}));
