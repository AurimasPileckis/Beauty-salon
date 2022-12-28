import express from 'express'
import db from '../database/connect.js'
import { saloonsValidator } from '../middleware/validate.js'
import { adminAuth } from '../middleware/auth.js'

const Router = express.Router()

Router.get('/', async (req, res) => {
    const options = {}

    if(req.query.sort === '1') {
        options.order = [
            ['name', 'ASC']
        ]
    }

    if(req.query.sort === '2') {
        options.order = [
            ['name', 'DESC']
        ]
    }

    try {
        const saloon = await db.Saloons.findAll(options)
        res.json(saloon)

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})


Router.get('/single/:id', adminAuth, async (req, res) => {
    try {
        const saloon = await db.Saloons.findByPk(req.params.id)
        res.json(saloon)
    } catch {
        res.status(500).send('Techninė klaida')
    }
})

Router.post('/new', adminAuth, saloonsValidator, async (req, res) => {
    try {
        await db.Saloons.create(req.body)
        res.send('Salonas sėkmingai sukurtas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.delete('/delete/:id', adminAuth, async (req, res) => {
    try {
        const saloon = await db.Saloons.findByPk(req.params.id)
        await saloon.destroy()
        res.send('Salonas sėkmingai ištrintas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Techninė klaida')

    }
})

Router.put('/edit/:id', adminAuth, saloonsValidator, async (req, res) => {
    try {
        const saloon = await db.Saloons.findByPk(req.params.id)
        saloon.update(req.body)
        res.send('Salono duomenys sėkmingai atnaujintas')

    } catch (error) {
        console.log(error)
        res.status(500).send('Server Techninė klaida')

    }
})

export default Router