-- SmartCampus Multi-Tenant Database Initialization
-- Application User: collegeuser
-- Creates isolated PostgreSQL database per service

CREATE DATABASE college_auth;
CREATE DATABASE college_master;
CREATE DATABASE college_student;
CREATE DATABASE college_faculty;
CREATE DATABASE college_course;
CREATE DATABASE college_enrollment;
CREATE DATABASE college_attendance;
CREATE DATABASE college_exam;
CREATE DATABASE college_timetable;
CREATE DATABASE college_fee;
CREATE DATABASE college_library;
CREATE DATABASE college_hostel;
CREATE DATABASE college_transport;
CREATE DATABASE college_leave;
CREATE DATABASE college_placement;
CREATE DATABASE college_event;
CREATE DATABASE college_notification;
CREATE DATABASE college_document;
CREATE DATABASE college_helpdesk;
CREATE DATABASE college_report;

-- Ensure collegeuser has full ownership and permissions across all databases
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
