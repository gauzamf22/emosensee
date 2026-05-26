const facilityService = require('../services/facilityService');

const getNearby = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parameter lat dan lng wajib disertakan' 
      });
    }

    const facilities = await facilityService.getNearbyMentalHealthFacilities(lat, lng);

    const formattedData = facilities.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      open_now: place.opening_hours ? place.opening_hours.open_now : null,
      location: place.geometry.location,
      place_id: place.place_id 
    }));

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data fasilitas terdekat',
      data: formattedData
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getNearby };