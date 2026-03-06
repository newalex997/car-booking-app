import { CreateSearchParams } from "@/types/booking";

export function toCreateSearchBody(params: CreateSearchParams) {
  const {
    location,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    residenceCountry,
  } = params;

  return {
    driver_age: "35",
    drop_off_city_id: location.cityID,
    drop_off_country_id: location.countryID,
    drop_off_location_id: location.placeID,
    drop_time: dropoffTime,
    dropoff_id: location.placeID,
    excludeLocations: 0,
    is_drop_off: false,
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
