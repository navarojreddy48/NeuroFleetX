CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  company_name VARCHAR(150),
  phone_number VARCHAR(30),
  city VARCHAR(120),
  license_number VARCHAR(80),
  registration_number VARCHAR(80),
  role VARCHAR(30) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  rating DOUBLE NOT NULL DEFAULT 4.5,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_name VARCHAR(120) NOT NULL,
  registration_number VARCHAR(80) NOT NULL UNIQUE,
  vehicle_type VARCHAR(60) NOT NULL,
  battery_level INT,
  fuel_level INT,
  speed DOUBLE,
  latitude DOUBLE,
  longitude DOUBLE,
  battery_percentage INT,
  battery_health INT,
  engine_temperature DOUBLE,
  tire_wear INT,
  city VARCHAR(120) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  driver_id BIGINT NOT NULL,
  vehicle_id BIGINT NOT NULL,
  start_location VARCHAR(200) NOT NULL,
  end_location VARCHAR(200) NOT NULL,
  distance DOUBLE NOT NULL,
  duration INT NOT NULL,
  trip_status VARCHAR(30) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  fare_amount DECIMAL(12, 2) NULL,
  CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
  CONSTRAINT fk_trips_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS driver_earnings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  driver_id BIGINT NOT NULL,
  trip_id BIGINT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  payout_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  CONSTRAINT fk_driver_earnings_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
  CONSTRAINT fk_driver_earnings_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS live_tracking (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  trip_id BIGINT NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  timestamp DATETIME NOT NULL,
  speed_kmph DOUBLE NULL,
  heading DOUBLE NULL,
  CONSTRAINT fk_live_tracking_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS vehicle_telemetry (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  speed DOUBLE NOT NULL,
  battery_level INT NOT NULL,
  fuel_level INT NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicle_telemetry_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS routes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  trip_id BIGINT NOT NULL,
  route_type VARCHAR(30) NOT NULL,
  estimated_time INT NOT NULL,
  optimized BOOLEAN NOT NULL DEFAULT FALSE,
  distance_km DOUBLE NULL,
  CONSTRAINT fk_routes_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS traffic_heatmap (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  congestion_level INT NOT NULL,
  recorded_at DATETIME NOT NULL,
  zone_name VARCHAR(120) NULL
);

CREATE TABLE IF NOT EXISTS ai_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  eta_accuracy DOUBLE NOT NULL,
  traffic_weight DOUBLE NOT NULL,
  energy_efficiency_weight DOUBLE NOT NULL,
  fuel_optimization_weight DOUBLE NULL,
  dynamic_routing_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  auto_reassignment_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  smart_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  trip_id BIGINT NULL,
  pickup_location VARCHAR(200) NOT NULL,
  drop_location VARCHAR(200) NOT NULL,
  pickup_time DATETIME NOT NULL,
  vehicle_type VARCHAR(60) NULL,
  booking_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  estimated_fare DECIMAL(12, 2) NULL,
  final_fare DECIMAL(12, 2) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES users(id),
  CONSTRAINT fk_bookings_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS booking_status_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL,
  changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes VARCHAR(255) NULL,
  CONSTRAINT fk_booking_history_booking FOREIGN KEY (booking_id) REFERENCES customer_bookings(id)
);

CREATE TABLE IF NOT EXISTS trip_payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id BIGINT NULL,
  trip_id BIGINT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(30) NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  transaction_ref VARCHAR(120) NULL,
  paid_at DATETIME NULL,
  CONSTRAINT fk_trip_payments_booking FOREIGN KEY (booking_id) REFERENCES customer_bookings(id),
  CONSTRAINT fk_trip_payments_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  alert_type VARCHAR(40) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(140) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alerts_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  vehicle_id BIGINT NOT NULL,
  issue VARCHAR(255) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  action_taken VARCHAR(255) NULL,
  serviced_on DATE NULL,
  next_service_due DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_maintenance_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS trip_events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  trip_id BIGINT NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  event_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  details VARCHAR(500) NULL,
  CONSTRAINT fk_trip_events_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
);

