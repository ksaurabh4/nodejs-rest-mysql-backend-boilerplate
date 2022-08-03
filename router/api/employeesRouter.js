const router = require('express').Router();
const EmployeesController = require('../../controllers/employees.controller');
const auth = require('../../utils/auth');
/**
   * @swagger
   * definitions:
   *   employees:
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
 * /employees/{EmployeeId}:
 *   get:
 *     tags:
 *       - employees
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: EmployeeId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/employees'
 */
router.get('/:id', auth.isAuthunticated, EmployeesController.getEmployeeById);

/**
 * @swagger
 * /employees/{employeeId}:
 *   delete:
 *     tags:
 *       - employees
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: EmployeeId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: delete user with id
 *         schema:
 *           $ref: '#/definitions/employees'
 */
// router.delete('/:id([0-9])', EmployeesController.deleteById);

/**
 * @swagger
 * /employees/{employeeId}:
 *   update:
 *     tags:
 *       - employees
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: EmployeeId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: update user with id
 *         schema:
 *           $ref: '#/definitions/employees'
 */
router.put('/:id', auth.isAuthunticated, EmployeesController.updateById);

/**
 * @swagger
 * /employees/profile:
 *   get:
 *     tags:
 *       - employees
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/employees'
 */
// router.get('/profile', auth.isAuthunticated, EmployeesController.getProfile);

/**
 * @swagger
 * /employees/create:
 *   post:
 *     tags:
 *       - employees
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/employees'
 */
router.post('/create', auth.isAuthunticated, auth.isUserCompanyAdmin, EmployeesController.createEmployee);

/**
 * @swagger
 * /employees:
 *   get:
 *     tags:
 *       - employees
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/employees'
 */
router.get('/', auth.isAuthunticated, auth.isUserSuperAdminOrCompanyAdminOrManager, EmployeesController.fetchEmployeesList);


module.exports = router;
