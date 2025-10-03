-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('student', 'administrator');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "public"."PublicationStatus" AS ENUM ('active', 'reported', 'deleted', 'suspended');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('spam', 'inappropriate_content', 'prohibited_content', 'plagiarism', 'other');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('pending', 'reviewed', 'resolved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."RatingType" AS ENUM ('like', 'dislike');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('new_publication', 'report_publication', 'material_uploaded', 'user_banned', 'user_registered', 'rating_added', 'comment_added');

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" SERIAL NOT NULL,
    "google_id" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_role" "public"."UserRole" NOT NULL,
    "profile_picture" VARCHAR(500),
    "status" "public"."UserStatus" NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "report_id" SERIAL NOT NULL,
    "publication_id" INTEGER,
    "reporter_user_id" INTEGER NOT NULL,
    "report_type" "public"."ReportType" NOT NULL,
    "description" TEXT,
    "report_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'pending',
    "reviewer_admin_id" INTEGER,
    "admin_comment" TEXT,
    "review_date" TIMESTAMP(3),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "public"."publications" (
    "publication_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "update_date" TIMESTAMP(3),
    "publication_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "total_ratings" INTEGER NOT NULL DEFAULT 0,
    "total_comments" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."PublicationStatus" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("publication_id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "comment_id" SERIAL NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_data" TEXT NOT NULL,
    "comment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMP(3),
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."ratings" (
    "rating_id" SERIAL NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating_type" "public"."RatingType" NOT NULL,
    "rating_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("rating_id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "file_id" SERIAL NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "file_type_id" INTEGER NOT NULL,
    "file_title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "web_url" VARCHAR(500),
    "filepath" VARCHAR(500),
    "size_bytes" INTEGER,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "public"."file_types" (
    "file_type_id" SERIAL NOT NULL,
    "file_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "mime_type" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "file_types_pkey" PRIMARY KEY ("file_type_id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT,
    "publication_id" INTEGER,
    "subject_id" INTEGER,
    "read_state" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."subjects" (
    "subject_id" SERIAL NOT NULL,
    "subject_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "public"."subject_enrollments" (
    "enrollment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subject_enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "public"."user_statistics" (
    "statistic_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "views_made" INTEGER NOT NULL DEFAULT 0,
    "materials_published" INTEGER NOT NULL DEFAULT 0,
    "reports_made" INTEGER NOT NULL DEFAULT 0,
    "reports_received" INTEGER NOT NULL DEFAULT 0,
    "files_downloaded" INTEGER NOT NULL DEFAULT 0,
    "comments_made" INTEGER NOT NULL DEFAULT 0,
    "ratings_given" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "update_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("statistic_id")
);

-- CreateTable
CREATE TABLE "public"."activity" (
    "activity_id" SERIAL NOT NULL,
    "activity_type" "public"."ActivityType" NOT NULL,
    "user_id" INTEGER,
    "publication_id" INTEGER,
    "subject_id" INTEGER,
    "user_name" VARCHAR(200),
    "publication_title" VARCHAR(300),
    "subject_name" VARCHAR(200),
    "description" TEXT,
    "activity_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("activity_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_user_id_key" ON "public"."user_statistics"("user_id");

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reviewer_admin_id_fkey" FOREIGN KEY ("reviewer_admin_id") REFERENCES "public"."users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("publication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publications" ADD CONSTRAINT "publications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."publications" ADD CONSTRAINT "publications_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("publication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "ratings_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("publication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("publication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_file_type_id_fkey" FOREIGN KEY ("file_type_id") REFERENCES "public"."file_types"("file_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("publication_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subject_enrollments" ADD CONSTRAINT "subject_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subject_enrollments" ADD CONSTRAINT "subject_enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_statistics" ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
