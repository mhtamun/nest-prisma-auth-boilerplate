import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { HashService } from '../src/util/hash.service';
const hash = new HashService();

async function main() {
  const role = await prisma.role.create({
    data: {
      name: 'Super Admin',
    },
  });

  console.debug({ role });

  await prisma.permission.create({
    data: {
      roleId: role.id,
      moduleName: 'user',
      permissionType: 'create',
    },
  });

  await prisma.permission.create({
    data: {
      roleId: role.id,
      moduleName: 'user',
      permissionType: 'read',
    },
  });

  await prisma.permission.create({
    data: {
      roleId: role.id,
      moduleName: 'user',
      permissionType: 'update',
    },
  });

  await prisma.permission.create({
    data: {
      roleId: role.id,
      moduleName: 'user',
      permissionType: 'delete',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Maruf Hossain',
      email: 'maruf@ahsantechnologies.com',
      password: await hash.generateHash('123456'),
      roleId: role.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
