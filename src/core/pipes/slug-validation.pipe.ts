import { BadRequestException, PipeTransform } from '@nestjs/common';

export class SlugValidationPipe implements PipeTransform {
	transform(value: string) {
		const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!value || !slugRegex.test(value)) {
			throw new BadRequestException(
				'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.'
			);
		}

		if (value.length > 100) {
			throw new BadRequestException('Slug is too long. Maximum length is 100 characters.');
		}

		return value;
	}
}
