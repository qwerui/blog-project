import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ConfigUpdateRequset } from 'src/dto/config.req';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService){}

    @Put()
    @UseGuards(JwtAuthGuard)
    updateConfig(@Body() configReq:ConfigUpdateRequset) {
        return this.configService.updateConfig(configReq.blogId, configReq.title, configReq.description, configReq.imagePath, configReq.deleteCategory, configReq.newCategory);
    }

    @Get()
    getConfig(@Query('userId') userId: string) {
        return this.configService.getConfig(userId);
    }
}
