import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        message: 'Unauthorized user'
    })
})

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) {
            return next(err);
        }
        const secretKey =process.env.SECRET_KEY ?? '';
        console.log(secretKey,"thanks")
        const token = jwt.sign({ email: user["_json"].email }, secretKey, {
            expiresIn: '30d'
        })
        res.cookie('jwtToken', token);
        res.cookie('isLoggedIn', true);
        res.redirect(`${process.env.CLIENT_URL}`);
        next()
        
    })(req, res, next);
});

export default router;   