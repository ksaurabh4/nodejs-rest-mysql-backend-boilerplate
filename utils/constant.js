exports.table = {
	companies: {
		compId: 'comp_id',
		compName: 'comp_name',
		compAddress: 'comp_address',
		compCity: 'comp_city',
		compState: 'comp_state',
		compCountry: 'comp_country',
		compZip: 'comp_zip',
		compWebsite: 'comp_website',
		compPhone: 'comp_phone',
		compEmail: 'comp_email',
	},
	employees: {
		empId: 'emp_id',
		empEmail: 'emp_email',
		empName: 'emp_name',
		empAddress: 'emp_adress',
		empCity: 'emp_city',
		empState: 'emp_state',
		empCountry: 'emp_country',
		empZip: 'emp_zip',
		empDept: 'emp_dept',
		empSubDept: 'emp_sub_dept',
		empDesignation: 'emp_designation',
		isManager: 'emp_is_manager',
		empManagerId: 'emp_manager_id',
		companyId: 'emp_comp_id',
		empPhone: 'emp_phone',
		empCode: 'emp_code',
	},
	users: {
		userId: 'user_id',
		isAdmin: 'user_is_admin',
		isActive: 'user_is_active',
		userRole: 'user_role',
		userEmail: 'user_email',
		userPswd: 'user_pswd',
	},
	plans: {
		planId: 'plan_id',
		planName: 'plan_name',
		planDuration: 'plan_duration',
		planDurationUnit: 'plan_duration_unit',
		planPrice: 'plan_price',
		planMaxEmployees: 'plan_max_employees',
	},
	subscriptions: {
		subsId: 'subs_id',
		subsStartDate: 'subs_start_date',
		subsEndDate: 'subs_end_date',
		subsIsActive: 'subs_is_active',
		companyId: 'subs_comp_id',
		planId: 'subs_plan_id',
	},
	goals: {
		goalId: 'goal_id',
		goalType: 'goal_type',
		goalTerm: 'goal_term',
		goalParameter: 'goal_parameter',
		goalAchieved: 'goal_achieved',
		goalScore: 'goal_score',
		goalReviewStartDate: 'goal_review_start_date',
		goalReviewEndDate: 'goal_review_end_date',
		empId: 'goal_emp_id',
		companyId: 'goal_comp_id',
		goalWeekNum: 'goal_week_num',
	},
};
