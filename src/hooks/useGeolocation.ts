import { useState, useEffect } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

export function useGeolocation(): GeolocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Browser Anda tidak mendukung geolocation');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Gagal mendapatkan lokasi';

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Kamu harus mengaktifkan akses lokasi terlebih dahulu';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia';
            break;
          case err.TIMEOUT:
            errorMessage = 'Permintaan lokasi timeout';
            break;
        }

        setError(errorMessage);
        setCoordinates(null);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    coordinates,
    error,
    loading,
    requestLocation,
  };
}
