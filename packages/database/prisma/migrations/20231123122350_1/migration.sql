-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS');

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "type" "TokenType" NOT NULL DEFAULT 'ACCESS',
    "value" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isShadow" BOOLEAN,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedOn" TIMESTAMP(3),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "signupToken" TEXT,
    "resetPasswordToken" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "oauthGoogle" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRequest" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "userID" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
