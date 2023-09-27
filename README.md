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

### 4. Admin Flow:
- Admins can manage the list of industries, adding, editing, or deleting entries.
- Admins can view, edit, or delete any employer profile.
- Admins can view, edit, or delete any user profile.
- Admins can manage job listings, including approving, editing, or deleting them.
- Admins can manage user reviews and comments, including approving, editing, or deleting them.

## Models restrictions

###User
 - id: Must be unique and not null.
 - email: Must be unique, not null, and should follow the valid email format.
 - username: Must be unique and not null.
 - firstName and lastName: Not null.
 - createdAt: Not null and should be a valid timestamp.
   
###Industry
- id: Must be unique and not null.
- name: Not null.

###Employer
- id: Must be unique and not null.
- industryId: Not null and must reference a valid Industry.id.
- name and location: Not null.
- createdAt: Not null and should be a valid timestamp.
  
###Job
- id: Must be unique and not null.
- employerId: Not null and must reference a valid Employer.id.
- title, description, and location: Not null.
- salaryFrom and salaryTo: Not null, where salaryFrom should be <= salaryTo.
- createdAt: Not null and should be a valid timestamp.

###Resume
- id: Must be unique and not null.
- userId: Not null and must reference a valid User.id.
- title and content: Not null.
- createdAt: Not null and should be a valid timestamp.
  
###Application
- id: Must be unique and not null.
- userId: Not null and must reference a valid User.id.
- jobId: Not null and must reference a valid Job.id.
- resumeId: Not null and must reference a valid Resume.id.
- status: Not null and might have predefined values like 'Pending', 'Approved', 'Rejected', etc.
- createdAt: Not null and should be a valid timestamp.

###Token
- id: Must be unique and not null.
- userId: Not null and must reference a valid User.id.
- value: Not null.
- createdAt and expiresAt: Not null and should be valid timestamps.

###Review
- id: Must be unique and not null.
- employerId: Not null and must reference a valid Employer.id.
- userId: Not null and must reference a valid User.id.
- rating: Not null and possibly between a range, e.g., 1-5.
- createdAt: Not null and should be a valid timestamp.

###Comment
- id: Must be unique and not null.
- userId: Not null and must reference a valid User.id.
- jobId: Not null and must reference a valid Job.id.
- text: Not null.
- createdAt: Not null and should be a valid timestamp.

###Feedback
- id: Must be unique and not null.
- applicationId: Not null and must reference a valid Application.id.
- content: Not null.
- createdAt: Not null and should be a valid timestamp.
  
###Admin
- id: Must be unique and not null.
- userId: Not null and must reference a valid User.id.
- The boolean permissions fields: Should either be true or false.

## Database diagram

![Untitled (3)](https://github.com/ilyevskii/job-hunter/assets/95957223/2cb4867b-2274-4876-b7fd-58a0c8b73380)


