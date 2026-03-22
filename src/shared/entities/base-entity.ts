import { UniqueEntityID } from './unique-entity-id';

export abstract class BaseEntity<Props> {
	private _id: UniqueEntityID;
	protected props: Props;

	get id() {
		return this._id;
	}

	protected constructor(props: Props, id?: UniqueEntityID) {
		this.props = props;
		this._id = id ?? new UniqueEntityID();
	}

	equals(entity: BaseEntity<unknown>) {
		if (entity === this) {
			return true;
		}
		if (entity.id === this._id) {
			return true;
		}
		return false;
	}
}
