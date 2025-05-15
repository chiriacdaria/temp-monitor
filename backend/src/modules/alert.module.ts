import { Module } from '@nestjs/common';
import { AlertsGateway } from '../gateways/alert.gateway';

@Module({
  providers: [AlertsGateway],  // Înregistrează gateway-ul în providers
})
export class AlertModule {}
