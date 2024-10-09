import { Module } from '@nestjs/common';
import { AdminPanelService } from './admin_panel.service';
import { AdminPanelController } from './admin_panel.controller';

@Module({
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
})
export class AdminPanelModule {}
