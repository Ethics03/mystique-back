import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';


@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService, ProfileService],
})
export class AppModule {}
