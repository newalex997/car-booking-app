import { BookingFormData } from "@/types/booking";

export interface BookingEntry {
  ocid: string;
  details: BookingFormData;
}

// identityDoc -> { bookingCode -> BookingEntry }
export const bookingsStore = new Map<string, Map<string, BookingEntry>>();
