import React from "react";

export default function Homepage() {
  return (
    <div className="px-6 md:px-12 lg:px-24 py-10">

      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold">
          Reliable Airport Transfers & Private Rides in Sacramento
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Book your ride in minutes. On-time pickup, smooth travel, and a service you can count on — day or night.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <a
            href="/book"
            className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90"
          >
            Book a Ride
          </a>

          <a
            href="tel:+1XXXXXXXXXX"
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Call Now
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-16 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="font-semibold text-lg">On-Time, Every Time</h3>
          <p className="text-gray-600 mt-2">
            Reliable pickups for airport transfers and local rides — no delays, no stress.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Simple Booking</h3>
          <p className="text-gray-600 mt-2">
            Book online in just a few steps. Fast confirmation and clear communication.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Flexible Scheduling</h3>
          <p className="text-gray-600 mt-2">
            Early morning or late-night trips — we’re available when you need a ride.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-center">
          Transportation Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-8 text-center">
          <div>
            <h4 className="font-semibold">Airport Transfers</h4>
            <p className="text-gray-600 mt-2">
              Convenient rides to and from the airport with timely pickup and smooth travel.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Private Rides</h4>
            <p className="text-gray-600 mt-2">
              Comfortable transportation for daily trips, appointments, or special occasions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Long Distance Trips</h4>
            <p className="text-gray-600 mt-2">
              Travel between cities with a private, direct, and hassle-free experience.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-8 text-center">
          <div>
            <h4 className="font-semibold">1. Book Online</h4>
            <p className="text-gray-600 mt-2">
              Enter your trip details and submit your booking request.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">2. Get Confirmation</h4>
            <p className="text-gray-600 mt-2">
              You’ll receive confirmation with all trip details and final pricing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">3. Enjoy Your Ride</h4>
            <p className="text-gray-600 mt-2">
              Sit back and relax while we take care of your journey.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-semibold">
              How soon will I get confirmation?
            </h4>
            <p className="text-gray-600">
              Usually within a short time after booking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Do you offer early morning rides?
            </h4>
            <p className="text-gray-600">
              Yes, we operate based on your schedule.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Can I book a round trip?
            </h4>
            <p className="text-gray-600">
              Yes, just include details in your booking.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold">
          Ready to Book Your Ride?
        </h2>

        <p className="text-gray-600 mt-2">
          Fast, reliable, and easy transportation — whenever you need it.
        </p>

        <a
          href="/book"
          className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-lg hover:opacity-90"
        >
          Book Now
        </a>
      </section>

    </div>
  );
}