import { BadRequestException, Injectable } from '@nestjs/common';
import { Status, UserType } from '@prisma/client';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { UserMessages } from '../../../shared/keys';

@Injectable()
export class PatientService {
  constructor(private userCoreService: UserCoreService) {}

  async findAll(query: BaseQueryCoreDto & { search?: string }) {
    const { search, ...rest } = query as any;
    const where: any = { isDeleted: false, userType: UserType.PATIENT };
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.userCoreService.findPaginate(rest, where);
  }

  async findOne(id: string) {
    const patient = await this.userCoreService.findFirst({
      where: { id, isDeleted: false, userType: UserType.PATIENT },
    });
    if (!patient) {
      throw new BadRequestException(UserMessages.NOT_FOUND);
    }
    const { password, passwordResetTokenHash, passwordResetExpires, ...safe } = patient as any;
    return safe;
  }

  async block(id: string) {
    await this.assertIsPatient(id);
    return this.userCoreService.update({
      where: { id },
      data: { status: Status.DISABLED },
    });
  }

  async unblock(id: string) {
    await this.assertIsPatient(id);
    return this.userCoreService.update({
      where: { id },
      data: { status: Status.ENABLED },
    });
  }

  private async assertIsPatient(id: string) {
    const patient = await this.userCoreService.findFirst({
      where: { id, isDeleted: false, userType: UserType.PATIENT },
    });
    if (!patient) {
      throw new BadRequestException(UserMessages.NOT_FOUND);
    }
    return patient;
  }
}
