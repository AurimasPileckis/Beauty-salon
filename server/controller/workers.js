import express from 'express'
import db from '../database/connect.js'
import upload from '../middleware/multer.js'
import { workersValidator } from '../middleware/validate.js'
import { adminAuth } from '../middleware/auth.js'
import Sequelize from 'sequelize'
const Router = express.Router()

Router.get('/', async (req, res) => {
    try {
        const options = {
            include: [
                {
                    model: db.Saloons,
                    attribute: ['name']
                },
                {
                    model: db.Ratings,
                    attributes: ['rating']
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('ratings.rating')), 'total_rating']
                ]
            },
            group: ['id']
        }
        if(req.query.saloon)
            options.where = {
                saloonId: req.query.saloon
            }
        if(req.query.sorting) {
            options.order = [
                [Sequelize.literal('total_rating'), req.query.sorting === '1' ? 'ASC' : 'DESC']
            ]
        }

        const workers = await db.Workers.findAll(options)
        res.json(workers)

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')

    }
})

Router.get('/single/:id', adminAuth, async (req, res) => {
    try {
        const worker = await db.Workers.findByPk(req.params.id, {
            attributes: ['first_name', 'last_name', 'photo', 'saloonId']
        })
        res.json(worker)
    } catch {
        res.status(500).send('Įvyko serverio klaida')
    }
})

Router.post('/new', adminAuth, upload.single('photo'), workersValidator, async (req, res) => {
    try {
        if(req.file)
            req.body.photo = '/uploads/' + req.file.filename

        await db.Workers.create(req.body)
        res.send('Darbuotojas sėkmingai išsaugotas')
    } catch(error) {
        console.log(error)
        res.status(500).send('Įvyko klaida išsaugant duomenis')
    }
})

Router.delete('/delete/:id', adminAuth, async (req, res) => {
    try {
        const worker = await db.Workers.findByPk(req.params.id)
        await worker.destroy()
        res.send('Darbuotjo duomenys ištrinti')

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')

    }
})

Router.put('/edit/:id', adminAuth, upload.single('photo'), workersValidator, async (req, res) => {
    try {
        if(req.file)
            req.body.photo = '/uploads/' + req.file.filename

        const worker = await db.Workers.findByPk(req.params.id)
        await worker.update(req.body)
        res.send('Darbuotjo duomenys sekmingai atnaujint')

    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')

    }
})

export default Router