import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

interface TransformedResponse<T> {
	data: T | T[];
	meta?: Record<string, unknown>;
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler
	): Observable<TransformedResponse<unknown>> {
		return next.handle().pipe(
			map(response => {
				if (!response) {
					return {
						data: []
					};
				}
				if (response.data && response.meta) {
					return {
						data: response.data,
						meta: response.meta
					};
				}
				return { data: response };
			})
		);
	}
}
