const axios = require('axios');

const getNearbyMentalHealthFacilities = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

  const response = await axios.get(nearbyUrl, {
    params: {
      location: `${lat},${lng}`,
      radius: 10000,
      keyword: 'psikiater OR psikolog OR klinik psikologi OR poli jiwa OR rumah sakit jiwa OR puskesmas OR RSUD',
      key: apiKey
    }
  });

  if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google API Error: ${response.data.error_message || response.data.status}`);
  }

  const places = response.data.results;

  const detailedPlaces = await Promise.all(
    places.map(async (place) => {
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
        
        const detailsResponse = await axios.get(detailsUrl, {
          params: {
            place_id: place.place_id,
            fields: 'formatted_phone_number,international_phone_number', 
            key: apiKey
          }
        });

        if (detailsResponse.data.status === 'OK') {
          return {
            ...place,
            formatted_phone_number: detailsResponse.data.result.formatted_phone_number || null,
            international_phone_number: detailsResponse.data.result.international_phone_number || null
          };
        }
      } catch (error) {
        console.error(`Gagal mengambil detail telepon untuk ${place.name}:`, error.message);
      }
      
      return { ...place, formatted_phone_number: null, international_phone_number: null };
    })
  );

  return detailedPlaces;
};

module.exports = { getNearbyMentalHealthFacilities };