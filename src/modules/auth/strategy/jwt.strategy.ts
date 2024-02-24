import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(readonly config: ConfigService, private readonly db: DbService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	async validate(payload: { email: string }): Promise<any> {
		try {
			const user = await this.db.user.findFirst({
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
					nid: true,
					dateOfBirth: true,
					gender: true,
					address: true,
					role: {
						select: { name: true, permissions: { select: { moduleName: true, permissionType: true } } },
					},
					status: true,
				},
				where: {
					email: payload.email,
					status: 'ACTIVE',
				},
			});
			// console.debug('user', user);

			return {
				...user,
			};
		} catch (error) {
			console.error('error', error);

			return false;
		}
	}
}
