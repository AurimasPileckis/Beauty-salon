export const auth = (req, res, next) => {
    if(req.session.loggedin)
        return next()

    res.status(401).send('Your session time is over')
}
export const adminAuth = (req, res, next) => {
    if(req.session.loggedin && req.session.user.role === 1)
        return next()

    res.status(401).send('Your session time is over')
}