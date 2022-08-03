

import { extend as _extend } from 'lodash';

const { extend } = _extend;

export const BadRequest = {
	error: 'Bad Request',
	status: 400,
};
export const Unauthorized = {
	error: 'Unauthorised',
	status: 401,
};
export const Forbidden = {
	error: 'Forbidden',
	status: 403,
};
export const NotFound = {
	error: 'Not Found',
	status: 404,
};
export const UnprocessableEntity = {
	status: 422,
	error: 'Unprocessable Entity',
};
export const InternalServerError = {
	error: 'Internal Server Error',
	status: 500,
};
export const Success = {
	error: '',
	status: 200,
};
export const onlyAdmin = extend({}, this.Forbidden, {
	message: 'Only admins are allowed to do this!',
});
export const NoPermesssion = extend({}, {
	error: 'Forbidden',
	status: 403,
	message: 'You do not have permission to consume this resource!',
});
export const invalidId = extend({}, this.BadRequest, {
	message: 'Invalid Id parameter',
});
export const invalidSearchTerm = extend({}, this.BadRequest, {
	message: 'Invalid search term',
});
export function missingAttr(attrs) {
	return extend({}, this.BadRequest, {
		message: `Attribute(s) (${attrs.join(',')}) seem(s) to be missing`,
	});
}
export function unwantedAttr(attrs) {
	return extend({}, this.BadRequest, {
		message: `Attribute(s) (${attrs.join(',')}) can't be updated`,
	});
}
export function uniqueAttr(attrs) {
	return extend({}, this.BadRequest, {
		message: `Attribute(s) [${attrs.join(',')}] must be unique`,
	});
}
export function custom(msg) {
	return extend({}, this.BadRequest, {
		message: msg,
	});
}
export function addFailure() {
	return extend({}, this.BadRequest, {
		message: 'Item WAS NOT added',
	});
}
export function deleteFailure() {
	return extend({}, this.BadRequest, {
		message: 'Item WAS NOT deleted',
	});
}
export function updateFailure() {
	return extend({}, this.BadRequest, {
		message: 'Item WAS NOT updated',
	});
}
export function addSuccess() {
	return extend({}, this.Success, {
		message: 'Item added successfully',
	});
}
export function deleteSuccess() {
	return extend({}, this.Success, {
		message: 'Item deleted successfully',
	});
}
export function updateSuccess() {
	return extend({}, this.Success, {
		message: 'Item updated successfully',
	});
}
export const empty = [];
