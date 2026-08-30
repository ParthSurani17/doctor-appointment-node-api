import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Dashboard')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({
    summary:
      'Aggregate counts for the admin dashboard (doctors, patients, appointments by status, 6-month chart)',
  })
  getStats() {
    return this.dashboardService.getStats();
  }
}
