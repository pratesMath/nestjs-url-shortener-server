import { Token } from '@auth-module/domain/entities/token';
import { setDateToBrazilianFormat } from '@shared/libs/date-fns';

export class TokenPresenter {
	static toHTTP(token: Token) {
		return {
			id: token.id.toString(),
			userId: token.userId.toValue(),
			code: token.code.toValue(),
			expiresIn: setDateToBrazilianFormat(token.expiresIn.toValue()),
			createdAt: setDateToBrazilianFormat(token.createdAt),
		};
	}
}
