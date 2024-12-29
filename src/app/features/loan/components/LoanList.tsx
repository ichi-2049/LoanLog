"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLoans } from '../hooks/useLoans';
import { FloatingActionButton } from '@/app/components/FloatingActionButton';

export const LoanList = () => {
    const router = useRouter();
    const { loans, viewType, setViewType, isLoading } = useLoans();
  
    if (isLoading) {
      return <div className="flex justify-center p-8">Loading...</div>;
    }

    const handleLoanClick = (loanId: string) => {
      router.push(`/loan/${loanId}`);
    };
  
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex mb-4 gap-2">
          <button
            className={`flex-1 py-2 px-4 rounded-lg ${
              viewType === 'debtor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewType('debtor')}
          >
            借
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg ${
              viewType === 'creditor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewType('creditor')}
          >
            貸
          </button>
        </div>
  
        <div className="space-y-2">
          {loans.map((loan) => (
            <div
              key={loan.loan_id}
              onClick={() => handleLoanClick(loan.loan_id)}
              className="flex items-center px-4 py-3 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-medium truncate">{loan.title}</div>
                <div className="text-sm truncate">
                  {viewType === 'debtor' ? loan.creditor.name : loan.debtor.name}
                </div>
              </div>
              
              <div className="flex-shrink-0 px-4 text-right">
                <div className="text-white">
                  ¥{loan.total_amount.toLocaleString()}
                </div>
              </div>
  
              <div className="flex-shrink-0 w-16 text-center">
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  loan.status === 'PAID' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {loan.status === 'PAID' ? '済' : '未'}
                </span>
              </div>
            </div>
          ))}
        </div>
  
        <FloatingActionButton href="/loan/register" />
      </div>
    );
  };