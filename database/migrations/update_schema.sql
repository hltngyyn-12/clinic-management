-- doctor
ALTER TABLE doctor ADD specialty VARCHAR(255);
ALTER TABLE doctor ADD experience INT;

-- patient
ALTER TABLE patient ADD date_of_birth DATE;
ALTER TABLE patient ADD gender VARCHAR(10);

-- appointment
ALTER TABLE appointment ADD appointment_time DATETIME;
ALTER TABLE appointment ADD status VARCHAR(50);