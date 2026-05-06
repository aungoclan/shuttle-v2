


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "full_name" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "email" "text",
    "service_type" "text" NOT NULL,
    "pickup_location" "text" NOT NULL,
    "dropoff_location" "text" NOT NULL,
    "pickup_date" "date" NOT NULL,
    "pickup_time" "text" NOT NULL,
    "passengers" "text",
    "luggage" "text",
    "preferred_contact" "text",
    "notes" "text",
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "internal_note" "text",
    "booking_code" "text",
    "confirmation_sent_at" timestamp with time zone,
    "confirmation_email" "text",
    "cancellation_sent_at" timestamp with time zone,
    "cancellation_email" "text",
    "estimated_price_min" numeric,
    "estimated_price_max" numeric,
    "estimated_price_text" "text",
    "final_price" numeric,
    "price_note" "text",
    "driver_reminder_24h_sent_at" timestamp with time zone,
    "driver_reminder_2h_sent_at" timestamp with time zone
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "bookings_booking_code_key" ON "public"."bookings" USING "btree" ("booking_code");



CREATE OR REPLACE TRIGGER "Send_booking_email" AFTER INSERT ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://labkqgghnczvpgugkcsm.functions.supabase.co/booking-email', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "set_bookings_updated_at" BEFORE UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin user can read own row" ON "public"."admin_users" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Admins can read bookings" ON "public"."bookings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Admins can update bookings" ON "public"."bookings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "au"
  WHERE ("au"."id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow all insert bookings" ON "public"."bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow delete for authenticated users" ON "public"."bookings" FOR DELETE TO "authenticated" USING (true);



ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







