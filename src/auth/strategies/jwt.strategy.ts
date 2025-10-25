import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { JwtPayload } from "@supabase/supabase-js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        
    ) {
        const jwtSecret = process.env.JWT_SECRET_KEY;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.auth_token;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    

    async validate(payload: JwtPayload) {
        try {
            if (!payload.sub) {
                throw new UnauthorizedException('Invalid token payload');
            }
            
            const token = await this.authService.validateToken(payload.sub);
            if (!token) {
                throw new UnauthorizedException('Token validation failed');
            }
            
            return token;
        } catch (error) {
            throw new UnauthorizedException(error.message || 'Token validation failed');
        }
    }
}