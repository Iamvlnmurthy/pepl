import {
    Controller,
    Post,
    Req,
    Res,
    HttpCode,
    HttpStatus,
    BadRequestException,
    Logger
} from '@nestjs/common';
import { Webhook } from 'svix';
import { ConfigService } from '@nestjs/config';
import { SyncService } from './sync.service';

@Controller('webhooks/clerk')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly syncService: SyncService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Req() req: any) {
        const payload = req.rawBody; // Need to ensure rawBody is available
        const headers = req.headers;

        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            throw new BadRequestException('Missing svix headers');
        }

        const secret = this.configService.get('CLERK_WEBHOOK_SECRET');
        if (!secret) {
            this.logger.error('CLERK_WEBHOOK_SECRET is not defined');
            throw new BadRequestException('Webhook configuration error');
        }

        const wh = new Webhook(secret);
        let evt: any;

        try {
            evt = wh.verify(payload.toString(), {
                'svix-id': svix_id as string,
                'svix-timestamp': svix_timestamp as string,
                'svix-signature': svix_signature as string,
            });
        } catch (err) {
            this.logger.error('Webhook verification failed', err);
            throw new BadRequestException('Invalid signature');
        }

        const { type, data } = evt;

        switch (type) {
            case 'user.created':
                await this.syncService.handleUserCreated(data);
                break;
            case 'user.updated':
                await this.syncService.handleUserUpdated(data);
                break;
            case 'user.deleted':
                await this.syncService.handleUserDeleted(data.id);
                break;
            default:
                this.logger.warn(`Unhandled webhook type: ${type}`);
        }

        return { success: true };
    }
}
