const router = require('express').Router();

// collect endpoints
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

// prefixed names
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
