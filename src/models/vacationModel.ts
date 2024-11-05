import Joi from "joi";
import { ValidationError } from "./exceptions";

class VacationModel {
    id?: number;
    destination: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
    imageFileName?: string;

    constructor(vm: Partial<VacationModel>) {
        this.id = vm.id || 0;
        this.destination = vm.destination || '';
        this.description = vm.description || '';
        this.price = vm.price || 0;
        this.startDate = this.formatDate(vm.startDate) || '';
        this.endDate = this.formatDate(vm.endDate) || '';
        this.imageFileName = vm.imageFileName;
    }

    private static validateSchema = Joi.object({
        id: Joi.number().optional(),
        destination: Joi.string().min(2).max(20).required(),
        description: Joi.string().optional().max(117),
        price: Joi.number().positive().max(10000).required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
        imageFileName: Joi.string().optional(),
    });

  
    private formatDate(date?: string): string | undefined {
        if (!date) return undefined;
        const d = new Date(date);
        return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' }); // ציין את אזור הזמן
    }
    
  
  
  

    validate(): void {
        const res = VacationModel.validateSchema.validate(this);
        if (res.error) {
            throw new ValidationError(res.error.details[0].message);
        }
    }
}

export default VacationModel;
