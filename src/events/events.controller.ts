import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-roles.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  async getAllEvents(@Query('category') category?: string) {
    return this.eventService.getAllEvents(category);
  }

  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createEvent(@Body() data: CreateEventDto) {
    return this.eventService.createEvent(data);
  }

  @Put(':eventId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() data: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(eventId, data);
  }

  @Patch(':eventId/slots')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async adjustSlots(
    @Param('eventId') eventId: string,
    @Body() data: { maxSlots: number; filledSlots: number },
  ) {
    return this.eventService.adjustSlots(
      eventId,
      data.maxSlots,
      data.filledSlots,
    );
  }

  @Patch(':eventId/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async toggleActive(@Param('eventId') eventId: string) {
    return this.eventService.activeToggle(eventId);
  }

  @Patch(':eventId/toggle-lock')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async toggleLock(@Param('eventId') eventId: string) {
    return this.eventService.toggleLock(eventId);
  }

  @Delete(':eventId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteEvent(@Param('eventId') eventId: string) {
    await this.eventService.deleteEvent(eventId);
    return { message: 'Event deleted successfully' };
  }
}
