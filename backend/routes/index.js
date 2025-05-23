const { Router } = require('express');
const router = Router();
const Orgrouter = require('./organizations');
const volrouter = require('./volunteers')
const eventrouter = require('./events')
const taskrouter = require('./tasks')
const skillsrouter = require('./skills')
const assignrouter = require('./assignments')
const attendrouter = require('./attendance')


router.use('/orgs', Orgrouter);
router.use('/vols' , volrouter);
router.use('/events' , eventrouter);
router.use('/tasks' , taskrouter);
router.use('/skills' , skillsrouter);
router.use('/assigns' , assignrouter);
router.use('/attend' , attendrouter);




module.exports = router;