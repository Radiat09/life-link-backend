"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBloodCompatible = void 0;
const isBloodCompatible = (donorBlood, recipientBlood) => {
    const compatibilityMap = {
        'O_NEGATIVE': ['O_NEGATIVE', 'O_POSITIVE', 'A_NEGATIVE', 'A_POSITIVE', 'B_NEGATIVE', 'B_POSITIVE', 'AB_NEGATIVE', 'AB_POSITIVE'],
        'O_POSITIVE': ['O_POSITIVE', 'A_POSITIVE', 'B_POSITIVE', 'AB_POSITIVE'],
        'A_NEGATIVE': ['A_NEGATIVE', 'A_POSITIVE', 'AB_NEGATIVE', 'AB_POSITIVE'],
        'A_POSITIVE': ['A_POSITIVE', 'AB_POSITIVE'],
        'B_NEGATIVE': ['B_NEGATIVE', 'B_POSITIVE', 'AB_NEGATIVE', 'AB_POSITIVE'],
        'B_POSITIVE': ['B_POSITIVE', 'AB_POSITIVE'],
        'AB_NEGATIVE': ['AB_NEGATIVE', 'AB_POSITIVE'],
        'AB_POSITIVE': ['AB_POSITIVE'],
    };
    return compatibilityMap[donorBlood]?.includes(recipientBlood) || false;
};
exports.isBloodCompatible = isBloodCompatible;
//# sourceMappingURL=isBloodMatched.js.map