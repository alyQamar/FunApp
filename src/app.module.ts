import { Module } from '@nestjs/common';
import { CustomConfigModule } from '@config/config.module';
import { UserModule } from '@user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CustomConfigModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
