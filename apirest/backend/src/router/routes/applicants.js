const bcrypt = require('bcrypt');
const { checkToken, checkAdmin } = require('../../middlewares/authentication');

//const { checks } = require('../../middlewares/validations')
//const { check, validationResult, checkSchema } = require('express-validator/check')
// ============================
// ======== CRUD user =========
// ============================

module.exports = (app, db) => {

    // GET all users applicants
    app.get('/applicants', checkToken, async(req, res, next) => {

        try {
            let users = await db.users.findAll();
            let applicants = await db.applicants.findAll();
            let applicantsView = [];

            for (let i = 0; i < users.length - 1; i++) {
                for (let j = 0; j < applicants.length - 1; j++) {
                    if (users[i].id === applicants[j].userId) {
                        applicantsView[j] = {
                            id: applicants[j].userId,
                            name: users[i].name,
                            email: users[i].email,
                            date_born: applicants[j].date_born,
                            premium: applicants[j].premium,
                            createdAt: applicants[j].createdAt
                        }
                    }
                }
            }
            res.status(200).json({
                ok: true,
                applicants: applicantsView
            });
        } catch (err) {
            next({ type: 'error', error: err.message });
        }

    });

    // POST single applicant
    app.post('/applicant', [checkToken, checkAdmin], async(req, res, next) => {
        let transaction;
        
        try{
            const body = req.body;
            const password = body.password ? bcrypt.hashSync(body.password, 10) : null;
    
            let msg;
            let user;
    

            // get transaction
            transaction = await db.sequelize.transaction();


            // step 1
            let _user = await db.users.create({
                name: body.name,
                password,
                email: body.email,

            }, {transaction: transaction});
            
            if(!_user){
                await transaction.rollback();
            }

            // step 2
            let applicant = await createApplicant(body, _user, next, transaction);
            
            if(!applicant){
                console.log("no");

                await transaction.rollback();
            }
            
            // commit
            await transaction.commit();

            return res.status(201).json({
                ok: true,
                message: `Applicant '${_user.name}' with id ${_user.id} has been created.`
            });
        }
        catch(err){
            //await transaction.rollback();
            next({ type: 'error', error: err.message });
        }
    });

    // PUT single applicant
    app.put('/applicant/:id([0-9]+)', [checkToken, checkAdmin], async(req, res, next) => {
        const id = req.params.id;
        const updates = req.body;

        if (updates.password)
            updates.password = bcrypt.hashSync(req.body.password, 10);

        try {
            let updated = await db.applicants.update(updates, {
                where: { userId: id }
            });
            if (updated) {
                res.status(200).json({
                    ok: true,
                    message: updates
                })
            }

        } catch (err) {
            next({ type: 'error', error: err.message });
        }
    });

    async function createApplicant(body, user, next, transaction) {
        try{
                let applicant = {};

                applicant.userId = user.id;
                applicant.city = body.city ? body.city : null;
                applicant.date_born = body.date_born ? body.date_born : null;
                applicant.premium = body.premium ? body.premium : null;
    
                console.log(applicant);

                let newapplicant = await db.applicants.create(applicant, {transaction: transaction});

                return newapplicant;
                
        }
        catch(err){
            await transaction.rollback();                    
            next({ type: 'error', error: err.message });
        }
    }
}