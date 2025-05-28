-- AlterTable
ALTER TABLE "product" ADD COLUMN     "average_rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reviews_count" INTEGER NOT NULL DEFAULT 0;
