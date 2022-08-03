const router = require('express').Router();
const SubscriptionsController = require('../../controllers/subscriptions.controller');
const { isUserCompanyAdminOrSuperAdmin } = require('../../utils/auth');
const auth = require('../../utils/auth');
/**
   * @swagger
   * definitions:
   *   subscriptions:
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
 * /subscriptions/{subsId}:
 *   get:
 *     tags:
 *       - subscriptions
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: SubsId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/subscriptions'
 */
router.get('/:id', auth.isAuthunticated, isUserCompanyAdminOrSuperAdmin, SubscriptionsController.getSubscriptionById);

/**
 * @swagger
 * /subscriptions/{subsId}:
 *   delete:
 *     tags:
 *       - subscriptions
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: SubsId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: delete user with id
 *         schema:
 *           $ref: '#/definitions/subscriptions'
 */
// router.delete('/:id([0-9])', SubscriptionsController.deleteById);

/**
 * @swagger
 * /subscriptions/{subsId}:
 *   update:
 *     tags:
 *       - subscriptions
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: SubsId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: update user with id
 *         schema:
 *           $ref: '#/definitions/subscriptions'
 */
router.put('/:id', auth.isAuthunticated, isUserCompanyAdminOrSuperAdmin, SubscriptionsController.updateSubscriptionById);

/**
 * @swagger
 * /subscriptions/profile:
 *   get:
 *     tags:
 *       - subscriptions
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/subscriptions'
 */
// router.get('/profile', auth.isAuthunticated, SubscriptionsController.getProfile);

/**
 * @swagger
 * /subscriptions/create:
 *   get:
 *     tags:
 *       - subscriptions
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/subscriptions'
 */
router.post('/create', auth.isAuthunticated, isUserCompanyAdminOrSuperAdmin, SubscriptionsController.createSubscription);


module.exports = router;
