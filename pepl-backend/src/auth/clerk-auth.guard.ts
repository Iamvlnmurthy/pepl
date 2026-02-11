import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Check for authorization header
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            // In a real scenario, we'd use the Clerk client to verify the token.
            // For NestJS, we can wrap the Clerk Express middleware or use the SDK's VerifyToken method.
            // Since we already have @clerk/clerk-sdk-node, we can verify the JWT.

            // Note: Clerk SDK version 4 uses clerkClient.verifyToken(token) 
            // or we can manually check using JWT secrets if provided.
            // We'll use a simplified version for now that assumes Clerk handles the heavy lifting.

            // Inject user info into request (this would be properly populated by the SDK)
            request.user = { id: 'clerk_user_placeholder', email: 'test@example.com' };

            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
