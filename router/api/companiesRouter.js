const router = require('express').Router();
const CompaniesController = require('../../controllers/companies.controller');
const { isUserCompanyAdminOrSuperAdmin, isUserSuperAdmin } = require('../../utils/auth');
const auth = require('../../utils/auth');
/**
   * @swagger
   * definitions:
   *   companies:
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
 * /companies/{companyId}:
 *   get:
 *     tags:
 *       - companies
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: CompanyId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/companies'
 */
router.get('/:id', auth.isAuthunticated, isUserCompanyAdminOrSuperAdmin, CompaniesController.getCompanyById);

/**
 * @swagger
 * /companies/{companyId}:
 *   delete:
 *     tags:
 *       - companies
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: CompanyId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: delete user with id
 *         schema:
 *           $ref: '#/definitions/companies'
 */
// router.delete('/:id([0-9])', CompaniesController.deleteById);

/**
 * @swagger
 * /companies/{companyId}:
 *   update:
 *     tags:
 *       - companies
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: CompanyId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: update user with id
 *         schema:
 *           $ref: '#/definitions/companies'
 */
router.put('/:id', auth.isAuthunticated, isUserCompanyAdminOrSuperAdmin, CompaniesController.updateCompanyById);

/**
 * @swagger
 * /companies/profile:
 *   get:
 *     tags:
 *       - companies
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/companies'
 */
// router.get('/profile', auth.isAuthunticated, CompaniesController.getProfile);

/**
 * @swagger
 * /companies/create:
 *   get:
 *     tags:
 *       - companies
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/companies'
 */
router.post('/create', auth.isAuthunticated, isUserSuperAdmin, CompaniesController.createCompany);

/**
 * @swagger
 * /companies:
 *   get:
 *     tags:
 *       - companies
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the companies list
 *         schema:
 *           $ref: '#/definitions/companies'
 */
router.get('/', auth.isAuthunticated, auth.isUserSuperAdmin, CompaniesController.fetchCompaniesList);


module.exports = router;
