CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) UNIQUE,
    "passwordHash" VARCHAR(255),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "avatarUrl" VARCHAR(255),
    "isEmailVerified" BOOLEAN DEFAULT false,
    "oauthGoogle" BOOLEAN DEFAULT false,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    "signupToken" VARCHAR(255),
    "resetPasswordToken" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Industry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Employer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "userId" INT,
    "location" VARCHAR(255),
    "numberOfWorkers" INT,
    "averageRating" INT DEFAULT 0,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Employer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "employerId" INT NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "location" VARCHAR(255),
    "salaryFrom" INT,
    "salaryTo" INT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "userId" INT,
    "title" VARCHAR(255),
    "content" TEXT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" INT,
    "jobId" INT,
    "resumeId" INT,
    "status" VARCHAR(255),
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "userId" INT,
    "value" TEXT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "expiresOn" TIMESTAMP WITH TIME ZONE,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "employerId" INT,
    "userId" INT,
    "rating" INT,
    "comments" TEXT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Review_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INT,
    "jobId" INT,
    "text" TEXT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Comment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE
);

CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "employerId" INT,
    "applicationId" INT,
    "content" TEXT,
    "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Feedback_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Feedback_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE
);

CREATE TABLE "Employer_Industry" (
    "id" SERIAL NOT NULL,
    "employerId" INT,
    "industryId" INT,

    CONSTRAINT "Employer_Industry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Employer_Industry_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE,
    CONSTRAINT "Employer_Industry_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE CASCADE
);

CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INT,
    "canEditJobs" BOOLEAN DEFAULT false,
    "canDeleteUsers" BOOLEAN DEFAULT false,
    "canManageEmployers" BOOLEAN DEFAULT false,
    "canEditReviews" BOOLEAN DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_user_createdOn" ON "User"("createdOn");
CREATE INDEX "idx_job_createdOn" ON "Job"("createdOn");
CREATE INDEX "idx_application_createdOn" ON "Application"("createdOn");
CREATE INDEX "idx_review_createdOn" ON "Review"("createdOn");
CREATE INDEX "idx_comment_createdOn" ON "Comment"("createdOn");
