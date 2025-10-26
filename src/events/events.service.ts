import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../auth/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/events.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(category?: string) {
    const events = await this.prisma.event.findMany({
      where: category ? { category } : undefined,
      include: {
        participants: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return events.map((event) => {
      const pendingCount = event.participants.filter(
        (p) => p.status === 'PENDING',
      ).length;
      const approvedCount = event.participants.filter(
        (p) => p.status === 'APPROVED',
      ).length;

      return {
        id: event.id,
        eventId: event.eventId,
        name: event.name,
        category: event.category,
        maxSlots: event.maxSlots,
        filledSlots: approvedCount,
        pendingCount: pendingCount,
        isActive: event.isActive,
        isLocked: event.isLocked,
        description: event.description,
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };
    });
  }

  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { eventId },
      include: {
        participants: {
          include: {
            cl: {
              select: {
                userId: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  //creating event
  async createEvent(data: CreateEventDto) {
    if (data.minTeamSize > data.maxTeamSize) {
      throw new BadRequestException(
        'Mininum team size cannot be greater than max team size',
      );
    }
    return this.prisma.event.create({
      data,
    });
  }
  async updateEvent(eventId: string, data: UpdateEventDto) {
    await this.getEventById(eventId);

    if (
      data.minTeamSize &&
      data.maxTeamSize &&
      data.minTeamSize > data.maxTeamSize
    ) {
      throw new BadRequestException(
        'minTeamSize cannot be greater than maxTeamSize',
      );
    }

    if (data.filledSlots !== undefined && data.maxSlots !== undefined) {
      if (data.filledSlots > data.maxSlots) {
        throw new BadRequestException('filledSlots cannot exceed maxSlots');
      }
    }

    return this.prisma.event.update({
      where: { eventId },
      data,
    });
  }

  async adjustSlots(eventId: string, maxSlots: number, filledSlots: number) {
    await this.getEventById(eventId);

    if (filledSlots > maxSlots) {
      throw new BadRequestException('filled slots cannot exceed maxslots');
    }

    if (filledSlots < 0 || maxSlots < 0) {
      throw new BadRequestException('Slots cannot be negative');
    }

    return this.prisma.event.update({
      where: { eventId },
      data: { maxSlots, filledSlots },
    });
  }

  async activeToggle(eventId: string) {
    const event = await this.getEventById(eventId);

    return this.prisma.event.update({
      where: { eventId },
      data: { isActive: !event.isActive }, //toggling here
    });
  }

  async toggleLock(eventId: string) {
    const event = await this.getEventById(eventId);

    return this.prisma.event.update({
      where: { eventId },
      data: { isLocked: !event.isLocked },
    });
  }

  async deleteEvent(eventId: string) {
    await this.getEventById(eventId);

    const participantsCount = await this.prisma.participant.count({
      where: { eventId },
    });

    if (participantsCount > 0) {
      throw new BadRequestException(
        'Cannot delete event with existing participants',
      );
    }

    return this.prisma.event.delete({
      where: { eventId },
    });
  }
}
