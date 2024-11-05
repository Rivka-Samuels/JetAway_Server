import VacationModel from "../models/vacationModel";
import FollowModel from "../models/followModel";
import { ValidationError } from "../models/exceptions";
import runQuery from "../db/dal";

// **Adding a follower between a user and a vacation**
export async function addFollow(userId: number, vacationId: number): Promise<void> {
    try {
        if (userId <= 0 || vacationId <= 0) {
            throw new ValidationError("Invalid user ID or vacation ID");
        }

        const existingFollow = await checkIfFollowExists(userId, vacationId);
        if (existingFollow) {
            console.warn(`Follow already exists: userId=${userId}, vacationId=${vacationId}`);
            return;
        }
        
        const follow = new FollowModel({ userId, vacationId });
        follow.validate();

        const q = `INSERT INTO follows (userId, vacationId) VALUES (?, ?);`;
        await runQuery(q, [userId, vacationId]);
    } catch (error) {
        console.error('Error adding follow:', error.message || error);
        throw error; 
    }
}

export async function deleteFollow(userId: number, vacationId: number): Promise<void> {
    try {
        if (userId <= 0 || vacationId <= 0) {
            throw new ValidationError("Invalid user ID or vacation ID");
        }

        const follow = new FollowModel({ userId, vacationId });
        follow.validate();

        const q = `DELETE FROM follows WHERE userId = ? AND vacationId = ?;`;
        await runQuery(q, [userId, vacationId]);
    } catch (error) {
        console.error('Error deleting follow:', error.message || error);
        throw error;
    }
}

export async function getFollowers(vacationId: number): Promise<number[]> {
    if (vacationId <= 0) {
        throw new ValidationError("Invalid vacation ID");
    }

    const q = `SELECT userId FROM follows WHERE vacationId = ?;`;
    const res = await runQuery(q, [vacationId]);

    return res.map((row: any) => row.userId);
}

export async function getVacationFollowedByUser(userId: number): Promise<VacationModel[]> {
    if (userId <= 0) {
        throw new ValidationError("Invalid user ID");
    }

    const q = `SELECT v.* FROM vacations v 
               JOIN follows f ON v.id = f.vacationId 
               WHERE f.userId = ?;`;
    const res = await runQuery(q, [userId]);

    return res.map((row: any) => new VacationModel(row));
}

async function checkIfFollowExists(userId: number, vacationId: number): Promise<boolean> {
    try {
        const checkQuery = `SELECT 1 FROM follows WHERE userId = ? AND vacationId = ? LIMIT 1;`;
        const result = await runQuery(checkQuery, [userId, vacationId]);
        return result.length > 0;
    } catch (error) {
        console.error('Error checking if follow exists:', error.message || error);
        throw error; 
    }
}
