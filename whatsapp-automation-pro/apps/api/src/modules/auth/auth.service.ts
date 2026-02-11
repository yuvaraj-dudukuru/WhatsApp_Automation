import { prisma } from '../../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    async register(data: any) {
        const { email, password, name } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        const token = this.generateToken(user.id);
        return { user: { id: user.id, email: user.email, name: user.name }, token };
    }

    async login(data: any) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user.id);
        return { user: { id: user.id, email: user.email, name: user.name }, token };
    }

    private generateToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    }
}

export const authService = new AuthService();
