import express from 'express'
import db from '../database/connect.js'
import { ratingsValidator } from '../middleware/validate.js'
import { auth } from '../middleware/auth.js'

const Router = express.Router()

Router.post('/worker/:wid/order/:oid', auth, ratingsValidator, async (req, res) => {
    const userId = req.session.user.id

    req.body.workerId = req.params.wid
    req.body.orderId = req.params.oid
    req.body.userId = userId
    
    try {
       await db.Ratings.create(req.body)
       res.send('Įvertinimas išsaugotas')
    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')
    }
})

export default Router