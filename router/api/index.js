

const router = require('express').Router();

router.use('/users', require('./usersRouter'));

router.use('/companies', require('./companiesRouter'));

router.use('/subscriptions', require('./subscriptionsRouter'));

router.use('/employees', require('./employeesRouter'));

router.use('/', require('./authRouter'));

module.exports = router;
