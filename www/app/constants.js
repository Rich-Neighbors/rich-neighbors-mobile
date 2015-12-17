angular.module('app')

.constant('HOST_URL', 'https://richneighbors-dev.herokuapp.com')

.constant('AUTH_EVENTS', {
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
	admin: 'admin_role',
	public: 'pulic_role'
});