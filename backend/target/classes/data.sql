INSERT INTO users (full_name, email, password, gender, company_name, phone_number, city, role, created_at, updated_at)
SELECT 'Fleet Manager Demo', 'fleetmanager.demo@neurofleet.ai', '$2a$10$4A7LROxqEOJ4N0Y9Mkl0xuIY0M4MooYx4z0Or7B2vyjS7f8Rxf9fO', 'Male', 'NeuroFleetX', '+91 9000000001', 'Bengaluru', 'FLEET_MANAGER', NOW(), NOW()
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'fleetmanager.demo@neurofleet.ai');

INSERT INTO users (full_name, email, password, gender, company_name, phone_number, city, license_number, role, created_at, updated_at)
SELECT 'Driver Demo', 'driver.demo@neurofleet.ai', '$2a$10$4A7LROxqEOJ4N0Y9Mkl0xuIY0M4MooYx4z0Or7B2vyjS7f8Rxf9fO', 'Male', 'NeuroFleetX', '+91 9000000002', 'Bengaluru', 'DL-998877-IND', 'DRIVER', NOW(), NOW()
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'driver.demo@neurofleet.ai');

INSERT INTO users (full_name, email, password, gender, company_name, phone_number, city, role, created_at, updated_at)
SELECT 'Customer Demo', 'customer.demo@neurofleet.ai', '$2a$10$4A7LROxqEOJ4N0Y9Mkl0xuIY0M4MooYx4z0Or7B2vyjS7f8Rxf9fO', 'Female', 'Retail', '+91 9000000003', 'Bengaluru', 'CUSTOMER', NOW(), NOW()
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'customer.demo@neurofleet.ai');

INSERT INTO drivers (user_id, license_number, rating, status)
SELECT u.id, 'DL-998877-IND', 4.7, 0
FROM users u
WHERE u.email = 'driver.demo@neurofleet.ai'
  AND NOT EXISTS (SELECT 1 FROM drivers d WHERE d.user_id = u.id);

INSERT INTO vehicles (vehicle_name, registration_number, vehicle_type, battery_percentage, battery_health, engine_temperature, tire_wear, city, status)
SELECT 'Tata Prima EV', 'KA-01-AB-1001', 'EV', 82, 90, 78.0, 18, 'Bengaluru', 0
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE registration_number = 'KA-01-AB-1001');

INSERT INTO vehicles (vehicle_name, registration_number, vehicle_type, battery_percentage, battery_health, engine_temperature, tire_wear, city, status)
SELECT 'Ashok Leyland AVTR', 'KA-01-AB-1002', 'Diesel', 60, 84, 92.0, 29, 'Bengaluru', 1
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE registration_number = 'KA-01-AB-1002');

INSERT INTO vehicles (vehicle_name, registration_number, vehicle_type, battery_percentage, battery_health, engine_temperature, tire_wear, city, status)
SELECT 'Eicher Pro 3019', 'KA-01-AB-1003', 'Diesel', 55, 80, 88.0, 24, 'Bengaluru', 0
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE registration_number = 'KA-01-AB-1003');

INSERT INTO trips (driver_id, vehicle_id, start_location, end_location, distance, duration, trip_status, created_at)
SELECT d.id, v.id, 'MG Road, Bengaluru', 'Electronic City, Bengaluru', 14.2, 52, 1, NOW() - INTERVAL 1 DAY
FROM drivers d
JOIN vehicles v ON v.registration_number = 'KA-01-AB-1001'
WHERE d.license_number = 'DL-998877-IND'
  AND NOT EXISTS (SELECT 1 FROM trips t WHERE t.start_location = 'MG Road, Bengaluru' AND t.end_location = 'Electronic City, Bengaluru');

INSERT INTO trips (driver_id, vehicle_id, start_location, end_location, distance, duration, trip_status, created_at)
SELECT d.id, v.id, 'Koramangala, Bengaluru', 'Whitefield, Bengaluru', 18.5, 67, 1, NOW() - INTERVAL 2 DAY
FROM drivers d
JOIN vehicles v ON v.registration_number = 'KA-01-AB-1002'
WHERE d.license_number = 'DL-998877-IND'
  AND NOT EXISTS (SELECT 1 FROM trips t WHERE t.start_location = 'Koramangala, Bengaluru' AND t.end_location = 'Whitefield, Bengaluru');

INSERT INTO trips (driver_id, vehicle_id, start_location, end_location, distance, duration, trip_status, created_at)
SELECT d.id, v.id, 'HSR Layout, Bengaluru', 'Airport Road, Bengaluru', 22.0, 71, 1, NOW() - INTERVAL 3 DAY
FROM drivers d
JOIN vehicles v ON v.registration_number = 'KA-01-AB-1003'
WHERE d.license_number = 'DL-998877-IND'
  AND NOT EXISTS (SELECT 1 FROM trips t WHERE t.start_location = 'HSR Layout, Bengaluru' AND t.end_location = 'Airport Road, Bengaluru');

INSERT INTO driver_earnings (driver_id, trip_id, amount, date)
SELECT t.driver_id, t.id, ROUND((t.distance * 35) * 0.78, 2), DATE(t.created_at)
FROM trips t
WHERE NOT EXISTS (SELECT 1 FROM driver_earnings de WHERE de.trip_id = t.id);

INSERT INTO customer_bookings (customer_id, trip_id, pickup_location, drop_location, pickup_time, vehicle_type, booking_status, estimated_fare, final_fare)
SELECT u.id, t.id, t.start_location, t.end_location, t.created_at, 'Sedan', 'COMPLETED', ROUND(t.distance * 35, 2), ROUND(t.distance * 35, 2)
FROM users u
JOIN trips t ON t.start_location = 'MG Road, Bengaluru' AND t.end_location = 'Electronic City, Bengaluru'
WHERE u.email = 'customer.demo@neurofleet.ai'
  AND NOT EXISTS (SELECT 1 FROM customer_bookings cb WHERE cb.trip_id = t.id);

INSERT INTO trip_payments (booking_id, trip_id, amount, payment_method, payment_status, transaction_ref, paid_at)
SELECT cb.id, cb.trip_id, cb.final_fare, 'UPI', 'PAID', CONCAT('TXN-', cb.id), NOW() - INTERVAL 1 DAY
FROM customer_bookings cb
WHERE cb.trip_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM trip_payments tp WHERE tp.booking_id = cb.id);

INSERT INTO alerts (user_id, alert_type, severity, title, message, is_read)
SELECT u.id, 'VEHICLE', 'HIGH', 'Battery health warning', 'Vehicle KA-01-AB-1002 battery health dropped below threshold.', FALSE
FROM users u
WHERE u.email = 'fleetmanager.demo@neurofleet.ai'
  AND NOT EXISTS (SELECT 1 FROM alerts a WHERE a.title = 'Battery health warning');

INSERT INTO maintenance_records (vehicle_id, issue, severity, action_taken, serviced_on, next_service_due)
SELECT v.id, 'Brake pad wear', 'MEDIUM', 'Replaced front brake pads', CURDATE() - INTERVAL 7 DAY, CURDATE() + INTERVAL 83 DAY
FROM vehicles v
WHERE v.registration_number = 'KA-01-AB-1002'
  AND NOT EXISTS (SELECT 1 FROM maintenance_records mr WHERE mr.vehicle_id = v.id AND mr.issue = 'Brake pad wear');

INSERT INTO traffic_heatmap (latitude, longitude, congestion_level, recorded_at)
SELECT 12.9716, 77.5946, 78, NOW() - INTERVAL 30 MINUTE
FROM dual
WHERE NOT EXISTS (
  SELECT 1 FROM traffic_heatmap th
  WHERE ABS(th.latitude - 12.9716) < 0.0001
    AND ABS(th.longitude - 77.5946) < 0.0001
);

INSERT INTO ai_settings (eta_accuracy, traffic_weight, energy_efficiency_weight)
SELECT 0.88, 0.45, 0.35
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM ai_settings);
