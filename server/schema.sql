CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  uid VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(150),
  email VARCHAR(150),
  password_hash VARCHAR(255) NOT NULL,
  faculty VARCHAR(150),
  department VARCHAR(50),
  programme VARCHAR(150),
  session VARCHAR(50),
  level VARCHAR(20),
  semester VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE students ADD COLUMN IF NOT EXISTS semester VARCHAR(20);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL, -- SuperAdmin, HOD, ExamOfficer
  department VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE TABLE results_issues (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) REFERENCES students(student_id),
  faculty VARCHAR(150),
  department VARCHAR(50),
  programme VARCHAR(150),
  session VARCHAR(50),
  course_code VARCHAR(20),
  course_title VARCHAR(150),
  lecturer_name VARCHAR(150),
  description VARCHAR(100),
  comment TEXT,
  status VARCHAR(30) DEFAULT 'Queued',
  attachment_url VARCHAR(500), -- S3 link
  date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) REFERENCES students(student_id),
  subject VARCHAR(150),
  type VARCHAR(30),
  recipient VARCHAR(30),
  recipient_email VARCHAR(150),
  admin_route VARCHAR(30),
  text TEXT,
  status VARCHAR(30) DEFAULT 'Queued',
  department VARCHAR(50),
  programme VARCHAR(150),
  level VARCHAR(20),
  session VARCHAR(50),
  faculty VARCHAR(150),
  attachment_url VARCHAR(500),
  date_submitted TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_uid VARCHAR(100) NOT NULL,
  message VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE status_history (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  item_type VARCHAR(20) NOT NULL, -- 'complaint' or 'results_issue'
  old_status VARCHAR(30),
  new_status VARCHAR(30),
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT NOW()
);
