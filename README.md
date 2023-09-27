# Platform for Job Hunting

## Functional requirements

### 1. User Management
- **1.1. Registration & Login**
  - Users can register with an email, username, first name, and last name.
  - Users can log in using their registered email.

- **1.2. Profile Management**
  - Users can view and update their personal details (firstName, lastName, email, username).

### 2. Industry Management
- **2.1. Browsing**
  - Users can view a list of industries with their name and description.

### 3. Employer Features
- **3.1. Employer Profile**
  - Employers can be associated with an industry.
  - Users can view details of an employer including name, location, number of workers, associated industry, and the date the employer was created.

- **3.2. Reviews**
  - Users can submit reviews for employers including ratings and comments.
  - Users can view reviews of different employers.

### 4. Job Listings
- **4.1. Browsing**
  - Users can view available jobs including job details like title, description, location, salary range, and associated employer.

- **4.2. Comments**
  - Users can add comments on job listings.
  - Users can view comments left by others on job listings.

### 5. Resumes
- **5.1. Creation & Management**
  - Users can create and manage multiple resumes, specifying the title and content of the resume.

### 6. Job Applications
- **6.1. Application Process**
  - Users can apply for jobs by submitting one of their created resumes.
  - Users can view the status of their application (e.g., pending, accepted, rejected).

- **6.2. Feedback**
  - After an application process, users can provide feedback on the application. This feedback is linked to the specific application.

### 7. User Authentication Tokens
- **7.1. Token Generation**
  - Upon successful login, users are issued a token for authentication.
  - Tokens have an expiration time.

- **7.2. Token Validation**
  - User actions that require authentication are validated using their issued token.

## Database diagram

![Untitled (1)](https://github.com/ilyevskii/job-hunter/assets/95957223/2f6a193c-5714-4f9a-8e00-e797fb5992f0)
