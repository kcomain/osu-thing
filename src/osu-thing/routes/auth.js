import crypto from 'crypto';
import * as db from '../lib/db.js';
import { loggers } from '../lib/utils.js'

import { Router } from 'express';
import asyncHandler from 'express-async-handler';

export const router = new Router();

// actually a frontend code lmao
router.get('/auth/osu', asyncHandler(async (req, res) => {
    loggers.oauth('received request, generating stuff...')
    const state = crypto.randomBytes(24).toString('hex')
    res.cookie('state', state, {
            expires: new Date(Date.now() + 900000), 
            httpOnly: true
        }).redirect(
            `https://osu.ppy.sh/oauth/authorize?client_id=${process.env.OSU_CLIENT_ID}` +
            `&redirect_uri=${process.env.CALLBACK_URL}&response_type=code&scopes=public identify` +
            `&state=${state}`
        )
}));

router.get('/auth/callback/osu', (req, res) => {
    res.send('fumo')
})
