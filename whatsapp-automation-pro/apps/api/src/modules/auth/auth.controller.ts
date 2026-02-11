import { Request, Response } from 'express';
import { authService } from './auth.service';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async me(req: Request, res: Response) {
        res.json({ user: (req as any).user });
    }
}

export const authController = new AuthController();
