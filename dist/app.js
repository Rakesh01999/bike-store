"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { StudentRoutes } from './app/modules/student/student.route';
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// /api/v1/students/create-student
// application routes
// app.use('/api/v1/students', StudentRoutes);
// const getAController = (req: Request, res: Response) => {
//   //   res.send('Hello World!')
//   const a = 10;
//   res.send(a);
// };
// app.get('/', getAController);
// console.log(process.cwd()); // E:\web\Programming Hero\Level 2\Mission 01-Be A Typescript Technocrat\Module 8-Mastering The Core concept of Mongoose\first-project
app.get('/', (req, res) => {
    const a = 10;
    res.send(a);
});
exports.default = app;
