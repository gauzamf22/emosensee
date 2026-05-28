import { useState, useEffect } from 'react';
import { MapPin, Phone } from "lucide-react";
import { useGeolocation } from '../hooks/useGeolocation';
import facilitiesService, { Facility } from '../services/facilities';

const NATIONAL_CONTACTS = [
  { name: "Ambulans", phone: "118 and 119" },
  { name: "Basarnas (SAR)", phone: "115" },
  { name: "Komisi Nasional (Komnas) HAM", phone: "021-3925230" },
  { name: "Komisi Nasional (Komnas) Perempuan", phone: "021-3903963" },
  { name: "Komisi Perlindungan Anak (KPAI)", phone: "021-31901556" },
];

export default function Emergency() {
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      fetchFacilities(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchFacilities = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await facilitiesService.getNearbyFacilities(lat, lng);
      // Filter only facilities with phone numbers
      const withPhone = data.filter(f => f.phone_number);
      setFacilities(withPhone);
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 -mt-2">
      <p className="font-['Inter'] font-medium text-sm text-[#9b9b9b]">
        Access urgent support resources.
      </p>

      {/* National Emergency Contacts */}
      <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] divide-y divide-[#EFEFF3]">
        {NATIONAL_CONTACTS.map((c) => {
          const tel = c.phone.replace(/[^0-9]/g, "");
          return (
            <a
              key={c.name}
              href={`tel:${tel}`}
              className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#F8F9FC] transition-colors"
            >
              <div className="size-12 sm:size-14 rounded-xl bg-[#F1F1F4] shrink-0 grid place-items-center">
                <Phone className="size-5 text-[#9b9b9b]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] truncate">
                  {c.name}
                </h4>
                <p className="font-['Nunito'] text-sm text-[#9b9b9b] mt-0.5 truncate">
                  {c.phone}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Nearby Mental Health Facilities */}
      {geoLoading || loading ? (
        <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 text-center">
          <p className="font-['Nunito'] text-sm text-[#9b9b9b]">Loading nearby facilities...</p>
        </div>
      ) : geoError ? (
        <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] p-4 text-center">
          <p className="font-['Nunito'] text-sm text-[#9b9b9b]">{geoError}</p>
          <p className="font-['Nunito'] text-xs text-[#9b9b9b] mt-1">Enable location to see nearby facilities</p>
        </div>
      ) : facilities.length > 0 ? (
        <div>
          <h3 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-sm mb-2">
            Nearby Mental Health Facilities
          </h3>
          <div className="bg-white rounded-2xl border border-[#EFEFF3] shadow-[0_8px_24px_-12px_rgba(17,24,39,0.06)] divide-y divide-[#EFEFF3]">
            {facilities.map((facility) => {
              const tel = facility.phone_number?.replace(/[^0-9]/g, "") || "";
              const initials = facility.name
                .split(' ')
                .slice(0, 2)
                .map(w => w[0])
                .join('')
                .toUpperCase();

              return (
                <a
                  key={facility.place_id}
                  href={`tel:${tel}`}
                  className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#F8F9FC] transition-colors"
                >
                  <div className="size-12 sm:size-14 rounded-xl bg-[#EEF2FF] shrink-0 grid place-items-center">
                    <span className="font-['Poppins'] font-bold text-[#3B5BDB] text-xs">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-['Poppins'] font-semibold text-[#1f1f1f] text-[15px] truncate">
                      {facility.name}
                    </h4>
                    <div className="flex items-center gap-1 font-['Nunito'] text-sm text-[#9b9b9b] mt-0.5">
                      <Phone className="size-3" />
                      <span className="truncate">{facility.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-1 font-['Nunito'] text-xs text-[#9b9b9b] mt-0.5">
                      <MapPin className="size-3" />
                      <span className="truncate">{facility.address}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
