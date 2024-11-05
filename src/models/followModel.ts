import Joi from "joi";
import { ValidationError } from "./exceptions";

class FollowModel {
    userId: number;  // The following user ID
    vacationId: number;  // The ID of the vacation being tracked

    constructor(fm: Partial<FollowModel>) {
        this.userId = fm.userId || 0;
        this.vacationId = fm.vacationId || 0;
    }

// Scheme to validate the data using Joi
    private static validateSchema = Joi.object({
        userId: Joi.number().positive().required().messages({
            'number.base': 'userId must be a number',
            'number.positive': 'userId must be a positive number',
            'any.required': 'userId is required'
        }),
        vacationId: Joi.number().positive().required().messages({
            'number.base': 'vacationId must be a number',
            'number.positive': 'vacationId must be a positive number',
            'any.required': 'vacationId is required'
        }),
    });

// Function to perform validation
    validate(): void {
        const { error } = FollowModel.validateSchema.validate(this);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }
    }
}

export default FollowModel;
