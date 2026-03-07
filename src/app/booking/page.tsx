import { Suspense } from "react";
import BookingView from "./BookingView";

export default function BookingPage() {
  return (
    <Suspense>
      <BookingView />
    </Suspense>
  );
}
