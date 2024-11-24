"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bike_route_1 = require("./app/modules/bike/bike.route");
const order_route_1 = require("./app/modules/order/order.route");
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// /api/v1/bikes/create-bike
// /api/v1/products/create-bike
// application routes
// app.use('/api/v1/bikes', BikeRoutes);
app.use('/api/products', bike_route_1.BikeRoutes);
app.use('/api', order_route_1.OrderRoutes);
const getAController = (req, res) => {
    //   res.send('Hello World!')
    // const a = 10;
    // res.send(a);
    res.sendStatus(200);
};
app.get('/', getAController);
// console.log(process.cwd()); // E:\web\Programming Hero\Level 2\Mission 01-Be A Typescript Technocrat\Module 8-Mastering The Core concept of Mongoose\first-project
exports.default = app;
