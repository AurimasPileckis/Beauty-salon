import express from 'express'
import db from '../database/connect.js'
import { ordersValidator } from '../middleware/validate.js'
import { auth, adminAuth } from '../middleware/auth.js'

const Router = express.Router()

Router.get('/', adminAuth, async (req, res) => {
    try {
        const orders = await db.Orders.findAll({
            include: [
                {
                   model: db.Users,
                   attributes: ['first_name', 'last_name']
                },
                {
                    model: db.Services,
                    attributes: ['name']
                }
            ]
        })
        res.json(orders)

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.get('/single/:id', adminAuth, async (req, res) => {
    try {
        const order = await db.Orders.findByPk(req.params.id)
        res.json(order)
    } catch(error) {
        console.log(error)
        res.status(500).send('Įvyko klaida išsaugant duomenis')
    }
})


Router.get('/user/', auth, async (req, res) => {
    const user_id = req.session.user.id
    try {
        const orders = await db.Orders.findAll({
            where: { userId: user_id },
            include: [
               {
                  model: db.Services, 
                  include: db.Saloons
               },
               db.Workers,
               db.Ratings
            ],
            group: ['id']
        })
        res.json(orders)

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.post('/new', auth, ordersValidator, async (req, res) => {
    try {
        await db.Orders.create(req.body)
        res.send('Užsakymas sėkmingai sukurtas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.delete('/delete/:id', adminAuth, async (req, res) => {
    try {
        const order = await db.Orders.findByPk(req.params.id)
        await order.destroy()
        res.send('Užsakymas ištrintas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.put('/edit/:id', adminAuth, ordersValidator, async (req, res) => {
    try {

        const order = await db.Orders.findByPk(req.params.id)
        await order.update(req.body)
        res.send('Užsakymas sėkmingai atnaujintas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

export default Router