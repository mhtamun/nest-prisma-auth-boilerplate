import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { HashService } from '../src/util/hash.service';
const hash = new HashService();

async function main() {
	try {
		const role = await prisma.role.create({
			data: {
				id: 1,
				name: 'Super Admin',
			},
		});

		await prisma.user.create({
			data: {
				name: 'Super Admin',
				email: 'super.admin@example.com',
				password: await hash.generateHash('password'),
				roleId: role.id,
				phone: '',
				nid: '',
				status: 'ACTIVE',
			},
		});
	} catch (error) {
		console.error(error);
	}
}

main()
	.catch(error => {
		console.error(error);

		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
