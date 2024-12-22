-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "google_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "uid" TEXT NOT NULL,
    "friend_uid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("uid","friend_uid")
);

-- CreateTable
CREATE TABLE "Loan" (
    "loan_id" TEXT NOT NULL,
    "creditor_uid" TEXT NOT NULL,
    "debtor_uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "remaining_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("loan_id")
);

-- CreateTable
CREATE TABLE "LoanHistory" (
    "loan_history_id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanHistory_pkey" PRIMARY KEY ("loan_history_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friend_uid_fkey" FOREIGN KEY ("friend_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_creditor_uid_fkey" FOREIGN KEY ("creditor_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_debtor_uid_fkey" FOREIGN KEY ("debtor_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanHistory" ADD CONSTRAINT "LoanHistory_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("loan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
