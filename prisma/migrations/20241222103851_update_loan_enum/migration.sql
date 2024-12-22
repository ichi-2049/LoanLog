/*
  Warnings:

  - The `status` column on the `loans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `memo` on table `loan_histories` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PAYING', 'PAID');

-- AlterTable
ALTER TABLE "loan_histories" ALTER COLUMN "memo" SET NOT NULL;

-- AlterTable
ALTER TABLE "loans" DROP COLUMN "status",
ADD COLUMN     "status" "LoanStatus" NOT NULL DEFAULT 'PAYING';
