import { Requester } from '@chainlink/external-adapter';
const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY;
const CLIMATIQ_API_ENDPOINT = process.env.CLIMATIQ_API_ENDPOINT;

type FlightClass = 'economic' | 'business' | 'first' | 'unknown';

export const getFlightEmission = async (flightParams: {
    data: {
        from: string;
        to: string;
        passengers: string;
        flightClass: FlightClass;
        id: string;
    };
}) => {
    // The Validator helps you validate the Chainlink request data
    //const validator = new Validator(callback, flightParams);

    if (!flightParams?.data) {
        return {
            status: 500,
            data: {
                error: 'Missing flight parameters'
            }
        };
    }

    const flightsApiUrl = `${CLIMATIQ_API_ENDPOINT}travel/flights`;
    const jobRunId = flightParams.data.id;

    const { from, to, passengers, flightClass } = flightParams.data;

    const headers = {
        Authorization: `Bearer ${CLIMATIQ_API_KEY}`
    };

    const config = {
        method: 'POST',
        headers,
        data: {
            legs: [
                {
                    from,
                    to,
                    passengers: parseInt(passengers),
                    flightClass
                }
            ]
        },
        url: flightsApiUrl
    };

    try {
        const response = await Requester.request(config);
        const { co2e, co2e_unit } = response.data;

        const filteredData = {
            data: { co2e: parseInt(co2e), co2eUnit: co2e_unit }
        };

        return {
            status: response.status,
            data: Requester.success(jobRunId, filteredData)
        };
    } catch (error) {
        return { status: 500, data: Requester.errored(jobRunId, error) };
    }
};
