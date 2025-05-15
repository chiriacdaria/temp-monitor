import { Module } from '@nestjs/common';
import { AlertModule } from './alert.module';

@Module({
  imports: [AlertModule],  // Adaugă AlertModule la array-ul imports
})
export class AppModule {}
