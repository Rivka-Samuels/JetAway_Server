import { ResultSetHeader } from "mysql2";
import runQuery from "../db/dal";
import { UnauthorizedError } from "../models/exceptions";
import UserModel from "../models/userModel";
import {
  createToken,
  encryptPassword,
  validatePassword,
} from "../utils/authUtils";

export async function createUser(user: UserModel) {
    // Validation
    user.validate();

    // Check if the email already exists in the database
    let checkEmailQuery = `SELECT * FROM users WHERE email = ?;`;
    const existingUser = await runQuery(checkEmailQuery, [user.email]);

    if (existingUser.length > 0) {
        throw new UnauthorizedError("Email already exists");
    }
    // Encrypt the password
    const hashedPassword = await encryptPassword(user.password);
  
    // Query to insert the new user
    let q = `INSERT INTO users (firstName, lastName, password, email, role) VALUES (?, ?, ?, ?, ?);`;
    let params = [user.firstName, user.lastName, hashedPassword, user.email, user.role];
  
    const insertedInfo = (await runQuery(q, params)) as ResultSetHeader | any;
    const userId = insertedInfo.insertId;
  
    // Add the ID to the user object
    user.id = userId; // Assumption that ID doesn't yet exist on the object
  
    // Create a token and update the user record
    user.token = createToken(user);
    q = `UPDATE users SET token=? WHERE id=?;`;
    params = [user.token, userId];
    await runQuery(q, params);
  
    return user.token;
}
  
export async function login(email: string, password: string) {
    // Look up the user by email
    let q = `SELECT * FROM users WHERE email=?;`;
    const res = await runQuery(q, [email]);
  
    // Check if the user exists
    if (res.length === 0) {
      throw new UnauthorizedError("User not found. Please register."); // Message if the user is not found
    }
  
    // Check if the password is correct
    if (!(await validatePassword(password, res[0].password))) {
      throw new UnauthorizedError("Incorrect password. Please try again."); // Message if the password is incorrect
    }
  
    // Create a user object and add a token if not already present
    const user = new UserModel(res[0]);
    if (!user.token) {
      user.token = createToken(user);
      q = `UPDATE users SET token=? WHERE id=?;`;
      await runQuery(q, [user.token, user.id]);
    }
  
    return user.token;
}
