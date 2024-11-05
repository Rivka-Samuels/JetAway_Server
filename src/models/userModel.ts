import Joi from "joi";
import { ValidationError } from "./exceptions";

interface UserInterface {
    id?: number;
    firstName: string;    
    lastName: string;    
    password?: string;   
    email: string;       
    role?: 'User' | 'Admin'; 
    token?: string;      
}

export default class UserModel {
    id?: number;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    role: 'User' | 'Admin';
    token?: string;

    constructor(user: UserInterface) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.email = user.email;
        this.role = user.role ?? 'User';
        this.token = user.token;
    }

    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        firstName: Joi.string().required().min(2).max(50),   
        lastName: Joi.string().required().min(2).max(50),    
        password: Joi.string().required().optional().min(4).max(255),   
        email: Joi.string().required().email(),              
        role: Joi.string().valid('User', 'Admin').optional(),
        token: Joi.string().optional(),
    });

    validate(): void {
        const { error } = UserModel.validateSchema.validate(this);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }
    }
}
