import { CreateSearchParams } from "@/types/booking";

export function toCreateSearchBody(params: CreateSearchParams) {
  const {
    location,
    dropoffLocation,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    residenceCountry,
  } = params;

  const dropoff = dropoffLocation ?? location;
  const isDifferentDropoff = !!dropoffLocation && dropoffLocation.placeID !== location.placeID;

  return {
    driver_age: "35",
    drop_off_city_id: dropoff.cityID,
    drop_off_country_id: dropoff.countryID,
    drop_off_location_id: dropoff.placeID,
    drop_time: dropoffTime,
    dropoff_id: dropoff.placeID,
    excludeLocations: 0,
    is_drop_off: isDifferentDropoff,
    is_whitelabel: false,
    partnerID: 0,
    pick_time: pickupTime,
    pick_up_city_id: location.cityID,
    pick_up_country_id: location.countryID,
    pick_up_location_id: location.placeID,
    pickup_from: `${pickupDate} ${pickupTime}`,
    pickup_id: location.placeID,
    pickup_to: `${dropoffDate} ${dropoffTime}`,
    recent_search: 0,
    residence_country: residenceCountry,
  };
}
