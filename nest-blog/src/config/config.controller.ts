import { Controller, Get, Put } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService){}

    @Put()
    updateConfig() {
        return this.configService.updateConfig();
    }

    @Get()
    getConfig() {
        return this.configService.getConfig();
    }
}
