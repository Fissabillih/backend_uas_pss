import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ResponseHelper } from '../utils/response';
import { ValidationError } from '../types';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.errors.map((e) => ({
          field: e.path.join('.').replace(/^body\.|^query\.|^params\./, ''),
          message: e.message,
        }));
        ResponseHelper.error(res, 'Validation failed', errors, 422);
        return;
      }
      next(error);
    }
  };
}
