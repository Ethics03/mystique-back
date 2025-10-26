import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaService } from '../auth/prisma.service';

@Module({
  providers: [ParticipantsService, PrismaService],
  controllers: [ParticipantsController],
  exports: [ParticipantsService, PrismaService],
})
export class ParticipantsModule {}
