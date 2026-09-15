-- SmartCampus Multi-Tenant Database Initialization
-- Application User: collegeuser
-- Safe, idempotent initialization for Docker environments

-- 1. Ensure collegeuser role exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'collegeuser') THEN
      CREATE ROLE collegeuser WITH LOGIN SUPERUSER PASSWORD 'collegepass';
   END IF;
END
$$;

-- 2. Create isolated databases for all 20 services conditionally
SELECT 'CREATE DATABASE college_auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_auth')
\gexec

SELECT 'CREATE DATABASE college_master' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_master')
\gexec

SELECT 'CREATE DATABASE college_student' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_student')
\gexec

SELECT 'CREATE DATABASE college_faculty' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_faculty')
\gexec

SELECT 'CREATE DATABASE college_course' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_course')
\gexec

SELECT 'CREATE DATABASE college_enrollment' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_enrollment')
\gexec

SELECT 'CREATE DATABASE college_attendance' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_attendance')
\gexec

SELECT 'CREATE DATABASE college_exam' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_exam')
\gexec

SELECT 'CREATE DATABASE college_timetable' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_timetable')
\gexec

SELECT 'CREATE DATABASE college_fee' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_fee')
\gexec

SELECT 'CREATE DATABASE college_library' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_library')
\gexec

SELECT 'CREATE DATABASE college_hostel' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_hostel')
\gexec

SELECT 'CREATE DATABASE college_transport' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_transport')
\gexec

SELECT 'CREATE DATABASE college_leave' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_leave')
\gexec

SELECT 'CREATE DATABASE college_placement' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_placement')
\gexec

SELECT 'CREATE DATABASE college_event' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_event')
\gexec

SELECT 'CREATE DATABASE college_notification' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_notification')
\gexec

SELECT 'CREATE DATABASE college_document' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_document')
\gexec

SELECT 'CREATE DATABASE college_helpdesk' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_helpdesk')
\gexec

SELECT 'CREATE DATABASE college_report' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'college_report')
\gexec

-- 3. Ensure collegeuser has full privileges on all databases
GRANT ALL PRIVILEGES ON DATABASE college_auth TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_master TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_student TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_faculty TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_course TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_enrollment TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_attendance TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_exam TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_timetable TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_fee TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_library TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_hostel TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_transport TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_leave TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_placement TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_event TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_notification TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_document TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_helpdesk TO collegeuser;
GRANT ALL PRIVILEGES ON DATABASE college_report TO collegeuser;
