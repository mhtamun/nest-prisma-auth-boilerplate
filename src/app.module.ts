import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
// System modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UtilityModule } from './util/utility.module';
import { LoggerMiddleware } from './util/logger.service';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';

// Application modules
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { FolderModule } from './modules/folder/folder.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),

		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				redis: {
					host: config.get('REDIS_HOST'),
					port: config.get('REDIS_PORT'),
				},
			}),
			inject: [ConfigService],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get('MONGO_DATABASE_URL'),
				// useNewUrlParser: true,
				// useUnifiedTopology: true,
				user: configService.get('MONGO_DB_USERNAME'),
				pass: configService.get('MONGO_DB_PASSWORD'),
				authSource: configService.get('MONGO_DB_AUTHSOURCE'),
				connectionFactory: connection => {
					connection.on('connected', () => {
						console.debug('MongoDB successfully connected!');
					});

					connection._events.connected();

					return connection;
				},
			}),
			inject: [ConfigService],
		}),
		DbModule,
		UtilityModule,
		AuthModule,
		UserModule,
		FolderModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL,
		});
	}
}
