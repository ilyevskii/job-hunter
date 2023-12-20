# Platform for Job Hunting

Andreyeuski Ilya 153501

## Functional requirements

### 1. Authorized User Flow:
- Users can register with an email (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/), username, first name, and last name.
- Users can log in using their registered email.
- Users can view and update their personal details (firstName, lastName, email, username).
- Users can view a list of industries with their name and description.
- Users can view available jobs including job details like title, description, location, salary range, and associated employer.
- Users can add comments on jobs.
- Users can view comments left by others on jobs.
- Users can create and manage resume, specifying the title and content.
- Users can apply for jobs by submitting their resume.
- Users can view the status of their application.
- After an application process, users can provide feedback on the application. This feedback is linked to the specific application.

### 2. Unauthorized User Flow:
- Users can view a list of industries with their name and description.
- Users can view available jobs including job details like title, description, location, salary range, and associated employer.
- Users can view comments left by others on job listings.

### 3. Employer Flow:
- Employers can register with an email, company name, and other essential details.
- Employers can log in using their registered email.
- Employers can create and manage their company profile, which includes associating with an industry, updating company details such as name, location, number of workers, and the date the company was established, uploading company logos and other relevant media.
- Employers can post new job listings with details like job title, description, location, salary range, and other relevant details.
- Employers can view, edit, or delete their job listings.
- Employers can view applications received for their job listings. This includes viewing the resumes and details of the applicants.
- Employers can change the status of applications (e.g., shortlisted, rejected, or accepted).
- Employers can respond to user reviews, addressing concerns or thanking users for positive feedback.

## Models restrictions

### User
- id (integer): Must be unique and not null.
- email (string): Must be unique, not null, and should follow the valid email format.
- username (string): Must be unique and not null.
- passwordHash (string): Must be correct hash.
- firstName (string), lastName (string): Not null.
- createdAt (timestamp): Not null and should be a valid timestamp.

### Industry
- id (integer): Must be unique and not null.
- name (string): Not null.

### Employer
- id (integer): Must be unique and not null.
- industryId (integer): Not null and must reference a valid Industry.id.
- name (string), location (string): Not null.
- createdAt (timestamp): Not null and should be a valid timestamp.

### Job
- id (integer): Must be unique and not null.
- employerId (integer): Not null and must reference a valid Employer.id.
- title (string), description (string), location (string): Not null.
- salaryFrom (integer), salaryTo (integer): Not null, where salaryFrom should be <= salaryTo.
- createdAt (timestamp): Not null and should be a valid timestamp.

### Resume
- id (integer): Must be unique and not null.
- userId (integer): Not null and must reference a valid User.id.
- title (string), content (string): Not null.
- createdAt (timestamp): Not null and should be a valid timestamp.

### Application
- id (integer): Must be unique and not null.
- userId (integer): Not null and must reference a valid User.id.
- jobId (integer): Not null and must reference a valid Job.id.
- resumeId (integer): Not null and must reference a valid Resume.id.
- status (string): Not null and might have predefined values like 'Pending', 'Approved', 'Rejected', etc.
- createdAt (timestamp): Not null and should be a valid timestamp.

### Token
- id (integer): Must be unique and not null.
- userId (integer): Not null and must reference a valid User.id.
- value (string): Not null.
- createdAt (timestamp), expiresAt (timestamp): Not null and should be valid timestamps.

### Feedback
- id (integer): Must be unique and not null.
- applicationId (integer): Not null and must reference a valid Application.id.
- content (string): Not null.
- createdAt (timestamp): Not null and should be a valid timestamp.

## Database diagram

![Untitled (1)](https://github.com/ilyevskii/job-hunter/assets/95957223/44474abf-2e2e-42b0-a93a-d3e6780dfac5)

