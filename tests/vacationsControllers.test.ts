import express from "express";
import { vacationRouter } from "../src/controllers/vacationControllers";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import { closeDB } from "../src/db/dal";

const VALID_TOKEN = process.env.VALID_TOKEN;


const app = express();
app.use(express.json());
app.use(vacationRouter);

describe("Vacation Controllers", () => {
    let vacationId: number | undefined;

    beforeAll(() => {
        console.log("Before all tests running ... ");
    });


// Test to return the vacation list
    it("Should return list of vacations", async () => {
        const response = await request(app)
            .get(appConfig.routePrefix + "/vacations")
            .set("Authorization", `Bearer ${VALID_TOKEN}`);

        vacationId = response.body[0]?.id;

        expect(response.status).toBe(StatusCode.Ok);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Check to return one vacation
    it("Should return a single vacation", async () => {
        if (!vacationId) {
            console.warn("There are no vacations to check 'Should return a single vacation'");
            return;
        }
        const response = await request(app)
            .get(appConfig.routePrefix + `/vacations/${vacationId}`)
            .set("Authorization", `Bearer ${VALID_TOKEN}`);

        expect(response.status).toBe(StatusCode.Ok);

        // tests if the response contains certain properties
        expect(response.body).toHaveProperty("price");
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("destination");
        expect(response.body).toHaveProperty("description");
        expect(response.body).toHaveProperty("startDate");
        expect(response.body).toHaveProperty("endDate");
    });

    // Check for a missing token
    it("Should return unauthorized for missing token", async () => {
        const response = await request(app)
            .get(appConfig.routePrefix + "/vacations");

        expect(response.status).toBe(StatusCode.Unauthorized);
    });
    // 
    afterAll(async () => {
        console.log("After all tests running..");
        await closeDB();
    });
});
