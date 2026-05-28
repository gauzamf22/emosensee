import api, { handleApiError } from './api';

export interface FacilityLocation {
  lat: number;
  lng: number;
}

export interface Facility {
  name: string;
  address: string;
  rating: number;
  open_now: boolean;
  location: FacilityLocation;
  phone_number: string | null;
  place_id: string;
}

interface FacilitiesResponse {
  success: boolean;
  message: string;
  data: Facility[];
}

const facilitiesService = {
  /**
   * Get nearby mental health facilities based on coordinates
   * @param lat - Latitude
   * @param lng - Longitude
   * @returns Array of nearby facilities
   */
  async getNearbyFacilities(lat: number, lng: number): Promise<Facility[]> {
    try {
      const response = await api.get<FacilitiesResponse>(
        '/api/facilities/nearby',
        { params: { lat, lng } }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default facilitiesService;
