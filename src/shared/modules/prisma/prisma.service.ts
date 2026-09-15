import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: ['error'] });

    process.on('use', async (params, next) => {
      if (params?.action === 'findUnique') {
        params.args.rejectOnNotFound = true;
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
    // Prisma cannot declare MongoDB partial indexes in schema.prisma.
    // Keep this database constraint in sync with the slot availability query.
    await this.$runCommandRaw({
      createIndexes: 'Appointment',
      indexes: [{
        key: { doctorId: 1, date: 1, timeSlot: 1 },
        name: 'unique_occupied_doctor_slot',
        unique: true,
        partialFilterExpression: {
          isDeleted: false,
          status: { $in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
        },
      }],
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}
