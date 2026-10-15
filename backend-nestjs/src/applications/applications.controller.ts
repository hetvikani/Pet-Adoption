import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body() createDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user, createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyApplications(@Req() req) {
    return this.applicationsService.getMyApplications(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  getAllApplications(@Query() query) {
    return this.applicationsService.getAllApplications(query);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, req.user._id, updateDto);
  }
}
