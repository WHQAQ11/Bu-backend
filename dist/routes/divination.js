"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const divinationController_1 = require("../controllers/divinationController");
const router = express_1.default.Router();
router.use(auth_1.AuthMiddleware.authenticate);
router.post('/calculate', divinationController_1.DivinationController.calculate);
router.get('/logs', divinationController_1.DivinationController.getUserLogs);
router.get('/stats', divinationController_1.DivinationController.getUserStats);
router.get('/logs/:id', divinationController_1.DivinationController.getLogById);
router.delete('/logs/:id', divinationController_1.DivinationController.deleteLog);
router.post('/interpret', divinationController_1.DivinationController.interpret);
router.post('/quick-interpret', divinationController_1.DivinationController.quickInterpret);
module.exports = router;
//# sourceMappingURL=divination.js.map