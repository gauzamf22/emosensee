const axios = require('axios');

const getNearbyMentalHealthFacilities = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

  const response = await axios.get(url, {
    params: {
      location: `${lat},${lng}`,
      radius: 5000,
      keyword: 'psikiater OR psikolog OR klinik psikologi OR poli jiwa OR rumah sakit jiwa OR puskesmas OR RSUD',
      key: apiKey
    }
  });

  if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google API Error: ${response.data.error_message || response.data.status}`);
  }

  return response.data.results;
};

module.exports = { getNearbyMentalHealthFacilities };