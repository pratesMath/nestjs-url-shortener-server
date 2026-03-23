import { User } from '@auth-module/domain/entities/user';
import { setDateToBrazilianFormat } from '@shared/libs/date-fns';

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.toString(),
			username: user.username,
			email: user.email.toValue(),
			createdAt: setDateToBrazilianFormat(user.createdAt),
			updatedAt: user.updatedAt ? setDateToBrazilianFormat(user.updatedAt) : null,
			deletedAt: user.deletedAt ? setDateToBrazilianFormat(user.deletedAt) : null,
		};
	}
}
