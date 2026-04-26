# clinic-management

A clinic management platform where patients can register accounts, book appointments, view medical records, and track treatment history. Doctors can manage schedules, access patient information, and record diagnoses. Administrators can oversee clinic operations, manage staff, appointments, and medical services.

## Demo Seed

To demo the full patient flow quickly:

1. Start the backend once so Hibernate creates the current schema.
2. Import [patient-demo-seed.sql](/d:/clinic-management/database/seeds/patient-demo-seed.sql).
3. Login with one of these accounts:

- `patient.demo.1 / patient123`
- `patient.demo.2 / patient123`
- `doctor.demo.1 / doctor123`
- `doctor.demo.2 / doctor123`

The seed includes demo doctors, patients, appointments, medical records, prescriptions, test requests, test results, and reviews.
