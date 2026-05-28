import { useState, useEffect } from 'react';
import { MapPin, Clock, SlidersHorizontal, HelpCircle, Crosshair, Search, Phone } from "lucide-react";
import { useGeolocation } from '../hooks/useGeolocation';
import facilitiesService, { Facility } from '../services/facilities';

export default function Nearby() {
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchFacilities(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchFacilities = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await facilitiesService.getNearbyFacilities(lat, lng);
      setFacilities(data);
    } catch (err) {
      setError('Failed to load nearby facilities');
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const locationName = latitude && longitude 
    ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    : 'Getting location...';

  const mapSrc = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`
    : `https://www.google.com/maps?q=Indonesia&z=5&output=embed`;

  return (
    <div className="flex flex-col gap-4 -mt-2">
      <div className="relative rounded-2xl overflow-hidden border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] bg-white">
        <div className="relative w-full h-[420px] sm:h-[520px] md:h-[600px]">
          <iframe
            title="Nearby map"
            src={mapSrc}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-white rounded-full shadow-md px-4 py-3 border border-[#EFEFF3]">
              <MapPin className="size-4 text-[#9b9b9b] shrink-0" />
              <span className="font-['Nunito'] text-sm text-[#1f1f1f] truncate flex-1">
                {geoError || locationName}
              </span>
              <Search className="size-4 text-[#9b9b9b] shrink-0" />
            </div>
          </div>

          <div className="absolute right-4 bottom-44 sm:bottom-48 z-10 flex flex-col gap-2">
            {[SlidersHorizontal, HelpCircle, Crosshair].map((Icon, i) => (
              <button
                key={i}
                className="size-10 rounded-xl bg-white shadow-md border border-[#EFEFF3] grid place-items-center text-[#1f1f1f] hover:bg-[#F6F7FB]"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 inset-x-0 z-10 px-4">
            {geoLoading || loading ? (
              <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-md p-4 text-center">
                <p className="font-['Nunito'] text-sm text-[#9b9b9b]">Loading facilities...</p>
              </div>
            ) : error || geoError ? (
              <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-md p-4 text-center">
                <p className="font-['Nunito'] text-sm text-red-500">{error || geoError}</p>
              </div>
            ) : facilities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-md p-4 text-center">
                <p className="font-['Nunito'] text-sm text-[#9b9b9b]">No facilities found nearby</p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1 scrollbar-thin">
                {facilities.map((facility) => {
                  const initials = facility.name
                    .split(' ')
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <article
                      key={facility.place_id}
                      className="snap-start shrink-0 w-[260px] sm:w-[280px] bg-white rounded-2xl border border-[#EFEFF3] shadow-md p-3 flex gap-3"
                    >
                      <div className="size-14 rounded-xl bg-[#EEF2FF] grid place-items-center shrink-0">
                        <span className="font-['Poppins'] font-bold text-[#3B5BDB] text-xs">
                          {initials}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col gap-1">
                        <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-sm truncate">
                          {facility.name}
                        </h4>
                        <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b]">
                          <MapPin className="size-3" />
                          <span className="truncate">{facility.address}</span>
                        </div>
                        {facility.open_now !== null && (
                          <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b]">
                            <Clock className="size-3" />
                            <span className="truncate">
                              {facility.open_now ? 'Open now' : 'Closed'}
                            </span>
                          </div>
                        )}
                        {facility.phone_number && (
                          <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b]">
                            <Phone className="size-3" />
                            <span className="truncate">{facility.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
