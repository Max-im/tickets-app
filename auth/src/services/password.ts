import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword:string, supplyedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        
        if (!(salt && hashedPassword)) return false;

        const buf = (await scryptAsync(supplyedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}