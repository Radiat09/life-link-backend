"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (zodSchema) => async (req, res, next) => {
    try {
        // req.body =JSON.parse(req.body.data || {}) || req.body
        let parsedBody = req.body;
        // Check if data field exists and needs parsing
        if (req.body?.data !== undefined) {
            if (typeof req.body.data === 'string') {
                try {
                    parsedBody = JSON.parse(req.body.data);
                }
                catch (parseError) {
                    return res.status(400).json({
                        success: false,
                        message: 'JSON Parse error: Invalid JSON in data field',
                        error: { message: 'Invalid JSON format' },
                    });
                }
            }
            else {
                // If data is already an object, use it directly
                parsedBody = req.body.data;
            }
        }
        req.body = await zodSchema.parseAsync(parsedBody);
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map