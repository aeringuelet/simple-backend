import express from 'express';
import { getFlightEmission } from '../modules/Flights';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Simple backend');
});

router.post('/flight-emission', async (req, res) => {
    const flightParams = req.body;
    console.log(flightParams);

    const { status, data } = await getFlightEmission(flightParams);

    res.status(status).json(data);
});

export default router;
