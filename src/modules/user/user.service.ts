import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import BaseService from '../base.service';
import { HashService } from 'src/util/hash.service';
import { NotificationService } from 'src/util/notification.service';
import { SignInUserDto, UserCreateDto, UserUpdateDto } from './dto';
import * as _ from 'lodash';

@Injectable()
export class UserService extends BaseService {
	@Inject()
	private readonly hash: HashService;

	@Inject()
	private readonly jwt: JwtService;

	@Inject()
	private readonly config: ConfigService;

	@Inject()
	private readonly notificationService: NotificationService;

	constructor() {
		super('user');
	}

	signToken(name: string, email: string): Promise<string> {
		const payload = {
			name,
			email,
		};

		return this.jwt.signAsync(payload, {
			issuer: 'example.com',
			subject: email,
			expiresIn: '7d',
			secret: this.config.get('JWT_SECRET'),
		});
	}

	async signIn(dto: SignInUserDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				const user = await tx.user.findUnique({
					select: { id: true, name: true, email: true, password: true },
					where: { email: dto.email, status: 'ACTIVE' },
				});

				const credentialNotCorrectError = {
					name: 'unauthorized',
					message: 'Unfortunately, you entered credentials are incorrect!',
				};

				if (!user) throw credentialNotCorrectError;

				const isPasswordMatched = await this.hash.matchHash(dto.password, user.password);

				if (!isPasswordMatched) throw credentialNotCorrectError;

				const token = await this.signToken(user.name, user.email);

				return {
					access_type: 'Bearer',
					access_token: token,
					user,
				};
			});

			return {
				success: true,
				message: `Hi, you are successfully signed in.`,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async save(dto: UserCreateDto) {
		try {
			const hashedPassword = await this.hash.generateHash(dto.password);

			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				const user = await super.create(tx, {
					...dto,
					password: hashedPassword,
					status: 'ACTIVE',
				});

				delete user.password;

				return user;
			});

			this.notificationService.sendEmail({
				to: data.email,
				subject: `User Creation Success`,
				html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>User Creation Success</title>
				</head>
				<body>
					<div style="background-color: #f4f4f4; padding: 20px;">
						<div style="max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
				
							<div style="text-align: center; padding: 20px;">
								<h1>User Created</h1>
							</div>
				
							<div style="padding: 20px;">
								<p>Hello ${dto.name},</p>
								<p>An admin user account has been successfully created in the system. Here are the details:</p>
				
								<h2>User Login Details:</h2>
								<ul>									
									<li>Full Name: ${dto.name}</li>
									<li>Email Address: ${dto.email}</li>
									<li>Password: ${dto.password}</li>
								</ul>
				
								<p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
				
								<p>Thank you for using our admin panel.</p>
				
								<p>Best regards,</p>
								<p>Example</p>
							</div>				
						</div>
					</div>
				</body>
				</html>
				`,
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async getAll() {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await tx.user.findMany({
					select: {
						id: true,
						name: true,
						email: true,
						roleId: true,
						role: {
							select: {
								name: true,
							},
						},
						phone: true,
						nid: true,
						address: true,
						status: true,
					},
				});
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async getById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await tx.user.findUnique({
					select: {
						id: true,
						name: true,
						email: true,
						roleId: true,
						role: {
							select: {
								name: true,
							},
						},
						phone: true,
						nid: true,
						address: true,
						status: true,
					},
					where: { id },
				});
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async editById(id: number, dto: UserUpdateDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.update(
					tx,
					{ id },
					{
						...dto,
					}
				);
			});

			const dao = super.getDao();
			const user = await dao.user.findFirst({ select: { role: { select: { name: true } } }, where: { id } });

			this.notificationService.sendEmail({
				to: data.email,
				subject: `User Information Update`,
				html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>User Information Update</title>
				</head>
				<body>
					<div style="background-color: #f4f4f4; padding: 20px;">
						<div style="max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
				
							<div style="text-align: center; padding: 20px;">
								<h1>User Information Update</h1>
							</div>
				
							<div style="padding: 20px;">
								<p>Hello ${dto.name},</p>
								<p>Your admin panel account information has been updated. Here are the details:</p>
				
								<h2>Updated Information:</h2>
								<ul>
									<li>Full Name: ${dto.name}</li>
									<li>Phone: ${dto.phone}</li>
									<li>NID: ${dto.nid}</li>									
									<li>Role: ${user.role.name}</li>									
								</ul>
				
								<p>If you did not initiate this update or have any questions regarding your account, please contact our support team immediately.</p>
				
								<p>Thank you for using our admin panel.</p>
				
								<p>Best regards,</p>
								<p>Example</p>
							</div>			
						</div>
					</div>
				</body>
				</html>
				`,
			});

			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async removeById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.delete(tx, { id });
			});

			this.notificationService.sendEmail({
				to: data.email,
				subject: `User Account Deletion`,
				html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>User Account Deletion</title>
				</head>
				<body>
					<div style="background-color: #f4f4f4; padding: 20px;">
						<div style="max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
				
							<div style="text-align: center; padding: 20px;">
								<h1>User Account Deletion</h1>
							</div>
				
							<div style="padding: 20px;">
								<p>Hello Admin,</p>
								<p>We regret to inform you that your admin panel account has been deleted. This action was taken as per your request or due to specific circumstances.</p>
				
								<p>If you believe this deletion was in error or have any questions or concerns, please contact company support team immediately.</p>
				
								<p>We appreciate your usage of our admin panel.</p>
				
								<p>Best regards,</p>
								<p>Example</p>
							</div>
				
						</div>
					</div>
				</body>
				</html>
				`,
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}
}
