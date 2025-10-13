"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(501).json({ message: '功能开发中' });
});
module.exports = router;
//# sourceMappingURL=logs.js.map