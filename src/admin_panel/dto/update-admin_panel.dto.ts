import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminPanelDto } from './create-admin_panel.dto';

export class UpdateAdminPanelDto extends PartialType(CreateAdminPanelDto) {}
