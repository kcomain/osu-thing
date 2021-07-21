import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as db from '../lib/db.js';

export const router = new Router();

router.get('/osu', asyncHandler(async (req, res) => {
    res.status(400).json({result: 'yes?', success: false});
}));
