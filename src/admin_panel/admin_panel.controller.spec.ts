import { Test, TestingModule } from '@nestjs/testing';
import { AdminPanelController } from './admin_panel.controller';
import { AdminPanelService } from './admin_panel.service';

describe('AdminPanelController', () => {
  let controller: AdminPanelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPanelController],
      providers: [AdminPanelService],
    }).compile();

    controller = module.get<AdminPanelController>(AdminPanelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
