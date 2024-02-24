import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class UtilityService {
	getTodayFormattedDate(): string {
		// Create a new Date object
		const currentDate = new Date();

		// Get the current date components
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
		const day = currentDate.getDate();

		// Format the date as a string
		const formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

		console.debug({ formattedDate });

		return formattedDate;
	}

	generateRandomName(): string {
		return faker.person.fullName();
	}

	generateRandomEmail(): string {
		return (
			faker.person.firstName().toLowerCase() +
			'.' +
			faker.person.lastName().toLowerCase() +
			'_' +
			faker.internet.email()
		);
	}

	generateRandomCountryCode(): string {
		return faker.location.countryCode();
	}

	generateRandomPhoneNumber(): string {
		return faker.phone.number();
	}

	generateRandomKey(length: number = 32): string {
		// Generate random bytes
		const randomBytes = crypto.randomBytes(length);

		// Convert bytes to a hex string
		const key = randomBytes.toString('hex');

		return key;
	}

	generateRandomOtp(length: number = 6) {
		return otpGenerator.generate(length, {
			digits: true,
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		});
	}

	getFormattedCountryCodeAndPhoneNumberForBangladesh(phone: string): { countryCode: string; phoneNumber: string } {
		let countryCode = undefined;
		let phoneNumber = undefined;

		// todo: Later we need to able add other than bangladeshi customer

		if (phone.length === 11 && phone.startsWith('01')) {
			countryCode = '+880';
			phoneNumber = phone.replace(/^0/, '');
		} else if (phone.length === 14 && phone.startsWith('+880')) {
			countryCode = '+880';
			phoneNumber = phone.substring(4);
		} else if (phone.length === 13 && phone.startsWith('880')) {
			countryCode = '+880';
			phoneNumber = phone.substring(4);
		} else
			throw {
				name: 'badRequest',
				message: 'Invalid phone number entered',
			};

		return { countryCode, phoneNumber };
	}

	objectToString(obj, indent = 1): string {
		let result = '';

		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				const value = obj[key];

				// Handle nested objects recursively
				if (typeof value === 'object' && value !== null) {
					result += `${'-'.repeat(indent)}${key}:\n\n${this.objectToString(value, indent + 1)}`;
				} else {
					result += `${'-'.repeat(indent)}${key}: ${value}\n\n`;
				}
			}
		}

		return result;
	}
}
