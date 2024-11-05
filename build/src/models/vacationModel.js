"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class VacationModel {
    constructor(vm) {
        this.id = vm.id || 0;
        this.destination = vm.destination || '';
        this.description = vm.description || '';
        this.price = vm.price || 0;
        this.startDate = this.formatDate(vm.startDate) || '';
        this.endDate = this.formatDate(vm.endDate) || '';
        this.imageFileName = vm.imageFileName;
    }
    formatDate(date) {
        if (!date)
            return undefined;
        const d = new Date(date);
        return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' }); // ציין את אזור הזמן
    }
    validate() {
        const res = VacationModel.validateSchema.validate(this);
        if (res.error) {
            throw new exceptions_1.ValidationError(res.error.details[0].message);
        }
    }
}
VacationModel.validateSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    destination: joi_1.default.string().min(2).max(20).required(),
    description: joi_1.default.string().optional().max(117),
    price: joi_1.default.number().positive().max(10000).required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).required(),
    imageFileName: joi_1.default.string().optional(),
});
exports.default = VacationModel;
