import runQuery from '../db/dal';
import { deleteImage, saveImage } from '../utils/helpers';
import { ValidationError } from '../models/exceptions';
import VacationModel from '../models/vacationModel';
import { UploadedFile } from 'express-fileupload';

// Get paginated vacations with sorting by start date
export async function getVacationsPaginated(page: number, limit: number): Promise<{ vacations: VacationModel[], total: number }> {
    const offset = page * limit;
    try {
        const vacationsQuery = `SELECT * FROM vacations ORDER BY startDate LIMIT ? OFFSET ?;`;
        const vacationsRes = await runQuery(vacationsQuery, [limit, offset]);
        const vacations = vacationsRes.map((v: any) => new VacationModel(v));

        const countQuery = `SELECT COUNT(*) AS total FROM vacations;`;
        const countRes = await runQuery(countQuery);
        const total = countRes[0]?.total || 0;

        return { vacations, total };
    } catch (error) {
        console.error("Error retrieving paginated vacations:", error);
        throw new Error("Failed to retrieve vacations");
    }
}

// Retrieve vacations by ID with optional sorting by start date
export async function getVacations(id?: number): Promise<VacationModel[]> {
    try {
        let query = `SELECT * FROM vacations`;
        const params: any[] = [];
        if (id) {
            query += ` WHERE id = ?`;
            params.push(id);
        }
        query += ` ORDER BY startDate ASC`;

        const res = await runQuery(query, params);
        if (res.length === 0 && id) throw new Error("Vacation ID not found");

        return res.map((v: any) => new VacationModel(v));
    } catch (error) {
        console.error("Error retrieving vacations:", error);
        throw error;
    }
}

// Add a new vacation
export async function addVacation(v: VacationModel, imageFile: UploadedFile) {
    v.validate();
    const imageFileName = await saveImage(imageFile);

    const query = `
        INSERT INTO vacations (destination, description, price, startDate, endDate, imageFileName)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    await runQuery(query, [v.destination, v.description || "", v.price, v.startDate, v.endDate, imageFileName]);
}

// Update vacation by ID
export async function updateVacation(v: Partial<VacationModel>, id: number, imageFile?: UploadedFile) {
    if (!v.destination && !v.price && !v.description && !v.startDate && !v.endDate && !imageFile) {
        throw new ValidationError("No fields specified to update!");
    }

    const vacations = await getVacations(id);
    if (vacations.length === 0) throw new Error("Vacation ID not found");

    const vacation = { ...vacations[0], ...v };
    if (vacation.validate) vacation.validate();

    if (imageFile) {
        const oldImageFileName = vacation.imageFileName;
        if (oldImageFileName) await deleteImage(oldImageFileName);
        vacation.imageFileName = await saveImage(imageFile);
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
    await runQuery(updateQuery, params);
}

// Delete vacation by ID
export async function deleteVacation(vacationId: number) {
    try {
        const imageQuery = `SELECT imageFileName FROM vacations WHERE id = ?;`;
        const images = await runQuery(imageQuery, [vacationId]);

        if (images.length === 0) throw new Error(`No images found for vacation ID ${vacationId}`);

        for (const image of images) {
            const imageFileName = image.imageFileName;
            if (imageFileName) await deleteImage(imageFileName);
        }

        const deleteQuery = `DELETE FROM vacations WHERE id = ?;`;
        await runQuery(deleteQuery, [vacationId]);
    } catch (error) {
        console.error(`Error deleting vacation with ID ${vacationId}:`, error);
        throw new Error(`Failed to delete vacation with ID ${vacationId}`);
    }
}
