import { Injectable } from '@nestjs/common';
import { CreateAdminPanelDto } from './dto/create-admin_panel.dto';
import { UpdateAdminPanelDto } from './dto/update-admin_panel.dto';

@Injectable()
export class AdminPanelService {
  create(createAdminPanelDto: CreateAdminPanelDto) {
    return 'This action adds a new adminPanel';
  }

  findAll() {
    return `This action returns all adminPanel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminPanel`;
  }

  update(id: number, updateAdminPanelDto: UpdateAdminPanelDto) {
    return `This action updates a #${id} adminPanel`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminPanel`;
  }
}
