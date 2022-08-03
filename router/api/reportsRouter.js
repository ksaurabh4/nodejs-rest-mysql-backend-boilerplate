const router = require('express').Router();
const ReportsController = require('../../controllers/reports.controller');
const auth = require('../../utils/auth');
/**
   * @swagger
   * definitions:
   *   plans:
   *     required:
   *       - id
   *       - email
   *     properties:
   *       id:
   *         type: integer
   *       email:
   *         type: string
   */


/**
 * @swagger
 * /plans/{PlanId}:
 *   get:
 *     tags:
 *       - plans
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: PlanId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/plans'
 */
router.get('/', auth.isAuthunticated, ReportsController.fetchReport);

/**
 * @swagger
 * /plans/{plansId}:
 *   delete:
 *     tags:
 *       - plans
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: PlanId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: delete user with id
 *         schema:
 *           $ref: '#/definitions/plans'
 */
// router.delete('/:id([0-9])', PlansController.deleteById);

/**
 * @swagger
 * /plans/{plansId}:
 *   update:
 *     tags:
 *       - plans
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: PlanId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: update user with id
 *         schema:
 *           $ref: '#/definitions/plans'
 */
// router.put('/:id', auth.isAuthunticated, isUserSuperAdmin, ReportsController.fetchReport);

/**
 * @swagger
 * /plans/profile:
 *   get:
 *     tags:
 *       - plans
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/plans'
 */
// router.get('/profile', auth.isAuthunticated, PlansController.getProfile);

/**
 * @swagger
 * /plans/create:
 *   get:
 *     tags:
 *       - plans
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/plans'
 */
// router.post('/create', auth.isAuthunticated, isUserSuperAdmin, PlansController.createPlan);


module.exports = router;
