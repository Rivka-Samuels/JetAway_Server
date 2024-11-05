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
exports.getVacationsPaginated = getVacationsPaginated;
exports.getVacations = getVacations;
exports.addVacation = addVacation;
exports.updateVacation = updateVacation;
exports.deleteVacation = deleteVacation;
const dal_1 = __importDefault(require("../db/dal"));
const helpers_1 = require("../utils/helpers");
const exceptions_1 = require("../models/exceptions");
const vacationModel_1 = __importDefault(require("../models/vacationModel"));
// Get paginated vacations with sorting by start date
function getVacationsPaginated(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const offset = page * limit;
        try {
            const vacationsQuery = `SELECT * FROM vacations ORDER BY startDate LIMIT ? OFFSET ?;`;
            const vacationsRes = yield (0, dal_1.default)(vacationsQuery, [limit, offset]);
            const vacations = vacationsRes.map((v) => new vacationModel_1.default(v));
            const countQuery = `SELECT COUNT(*) AS total FROM vacations;`;
            const countRes = yield (0, dal_1.default)(countQuery);
            const total = ((_a = countRes[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            return { vacations, total };
        }
        catch (error) {
            console.error("Error retrieving paginated vacations:", error);
            throw new Error("Failed to retrieve vacations");
        }
    });
}
// Retrieve vacations by ID with optional sorting by start date
function getVacations(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = `SELECT * FROM vacations`;
            const params = [];
            if (id) {
                query += ` WHERE id = ?`;
                params.push(id);
            }
            query += ` ORDER BY startDate ASC`;
            const res = yield (0, dal_1.default)(query, params);
            if (res.length === 0 && id)
                throw new Error("Vacation ID not found");
            return res.map((v) => new vacationModel_1.default(v));
        }
        catch (error) {
            console.error("Error retrieving vacations:", error);
            throw error;
        }
    });
}
// Add a new vacation
function addVacation(v, imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        v.validate();
        const imageFileName = yield (0, helpers_1.saveImage)(imageFile);
        const query = `
        INSERT INTO vacations (destination, description, price, startDate, endDate, imageFileName)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
        yield (0, dal_1.default)(query, [v.destination, v.description || "", v.price, v.startDate, v.endDate, imageFileName]);
    });
}
// Update vacation by ID
function updateVacation(v, id, imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!v.destination && !v.price && !v.description && !v.startDate && !v.endDate && !imageFile) {
            throw new exceptions_1.ValidationError("No fields specified to update!");
        }
        const vacations = yield getVacations(id);
        if (vacations.length === 0)
            throw new Error("Vacation ID not found");
        const vacation = Object.assign(Object.assign({}, vacations[0]), v);
        if (vacation.validate)
            vacation.validate();
        if (imageFile) {
            const oldImageFileName = vacation.imageFileName;
            if (oldImageFileName)
                yield (0, helpers_1.deleteImage)(oldImageFileName);
            vacation.imageFileName = yield (0, helpers_1.saveImage)(imageFile);
        }
        const updateFields = [
            v.destination && `destination = ?`,
            v.description && `description = ?`,
            v.price && `price = ?`,
            v.startDate && `startDate = ?`,
            v.endDate && `endDate = ?`,
            vacation.imageFileName && `imageFileName = ?`
        ].filter(Boolean).join(', ');
        const params = [v.destination, v.description, v.price, v.startDate, v.endDate, vacation.imageFileName, id].filter(Boolean);
        const updateQuery = `UPDATE vacations SET ${updateFields} WHERE id = ?;`;
        yield (0, dal_1.default)(updateQuery, params);
    });
}
// Delete vacation by ID
function deleteVacation(vacationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imageQuery = `SELECT imageFileName FROM vacations WHERE id = ?;`;
            const images = yield (0, dal_1.default)(imageQuery, [vacationId]);
            if (images.length === 0)
                throw new Error(`No images found for vacation ID ${vacationId}`);
            for (const image of images) {
                const imageFileName = image.imageFileName;
                if (imageFileName)
                    yield (0, helpers_1.deleteImage)(imageFileName);
            }
            const deleteQuery = `DELETE FROM vacations WHERE id = ?;`;
            yield (0, dal_1.default)(deleteQuery, [vacationId]);
        }
        catch (error) {
            console.error(`Error deleting vacation with ID ${vacationId}:`, error);
            throw new Error(`Failed to delete vacation with ID ${vacationId}`);
        }
    });
}
