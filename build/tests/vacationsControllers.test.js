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
const express_1 = __importDefault(require("express"));
const vacationControllers_1 = require("../src/controllers/vacationControllers");
const supertest_1 = __importDefault(require("supertest"));
const appConfig_1 = require("../src/utils/appConfig");
const statusEnum_1 = require("../src/models/statusEnum");
const dal_1 = require("../src/db/dal");
const VALID_TOKEN = process.env.VALID_TOKEN;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(vacationControllers_1.vacationRouter);
describe("Vacation Controllers", () => {
    let vacationId;
    beforeAll(() => {
        console.log("Before all tests running ... ");
    });
    // Test to return the vacation list
    it("Should return list of vacations", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const response = yield (0, supertest_1.default)(app)
            .get(appConfig_1.appConfig.routePrefix + "/vacations")
            .set("Authorization", `Bearer ${VALID_TOKEN}`);
        vacationId = (_a = response.body[0]) === null || _a === void 0 ? void 0 : _a.id;
        expect(response.status).toBe(statusEnum_1.StatusCode.Ok);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    // Check to return one vacation
    it("Should return a single vacation", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!vacationId) {
            console.warn("There are no vacations to check 'Should return a single vacation'");
            return;
        }
        const response = yield (0, supertest_1.default)(app)
            .get(appConfig_1.appConfig.routePrefix + `/vacations/${vacationId}`)
            .set("Authorization", `Bearer ${VALID_TOKEN}`);
        expect(response.status).toBe(statusEnum_1.StatusCode.Ok);
        // tests if the response contains certain properties
        expect(response.body).toHaveProperty("price");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("destination");
        expect(response.body).toHaveProperty("description");
        expect(response.body).toHaveProperty("startDate");
        expect(response.body).toHaveProperty("endDate");
    }));
    // Check for a missing token
    it("Should return unauthorized for missing token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(appConfig_1.appConfig.routePrefix + "/vacations");
        expect(response.status).toBe(statusEnum_1.StatusCode.Unauthorized);
    }));
    // 
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("After all tests running..");
        yield (0, dal_1.closeDB)();
    }));
});
