import express from 'express'
import bcrypt from 'bcrypt'
import db from '../database/connect.js'
import { registerValidator, loginValidator } from '../middleware/validate.js'
import { auth } from '../middleware/auth.js' 

const router = express.Router()



router.post('/register', registerValidator, async (req, res) => {
    try {
        const userExists = await db.Users.findOne({ 
            where: { 
                email: req.body.email 
            } 
        })
        
        if(userExists) {
            res.status(401).send('This user already exists')
            return
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        await db.Users.create(req.body)
        res.send('New user has been successfully created')

    } catch(error) {

        console.log(error)
        res.status(418).send('Server error')
    }
})

router.post('/login', loginValidator, async (req, res) => {
    try {
        const user = await db.Users.findOne({ 
            where: { 
                email: req.body.email 
            } 
        })
        
        if(!user) 
            return res.status(401).send('User not found')

        if(await bcrypt.compare(req.body.password, user.password)) {
            req.session.loggedin = true
            req.session.user = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
            res.send({ message: 'Login successful', user: req.session.user })
        } else {
            res.status(401).send('Login failed')
        }
    } catch(error) {
        console.log(error)
        res.status(418).send('Server error')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.send('You just have been logged out')
})

router.get('/check-auth', auth, async (req, res) => {
    res.json(req.session.user)
})

export default router