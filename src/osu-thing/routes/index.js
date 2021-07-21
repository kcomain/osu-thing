import { Router } from 'express';

export const router = new Router()

router.route('/')
    .get((req, res) => {
        res.render('index', {
            title: 'Internal Authentication Server', 
            body: '<h1>Hello!</h1>\nYou have stumbled upon a place where you should ' +
                  'not be. If you are absolutely sure you should be here, take a look ' +
                  'at <a href="/routes">/routes</a>'
        })
    })


router.get('/error', (req, res) => {
    cscfd
})