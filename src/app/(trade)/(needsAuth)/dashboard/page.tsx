'use client'

import React, { useState, useEffect } from 'react';
import Verify from '@/components/cards/Verify';
import Button from '@/components/ui/Button';
import { Clock, EyeOff, SquareAsterisk, Moon, Sun } from 'lucide-react';
import DashboardLayout from './layout';
import { getImage } from '@/lib/utils';

const Dashboard = () => {
  //TODO: @mbawon settings and account page

  const circleImg = getImage("add-circle.svg");
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium dark:text-white">Get Started</h1>
      </div>

      <div className="flex flex-col justify-start gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <Verify />
          </div>
          <div className="flex flex-col justify-between border border-gray-500 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
            <h1 className="text-xl font-medium dark:text-white">Trade Crypto above $500</h1>
            <div className="flex flex-row items-center gap-3">
              <Clock className="text-gray-500 w-6 h-6" />
              <span className="text-gray-500 dark:text-gray-400">Pending</span>
            </div>
          </div>

          <div className="flex flex-col justify-between border border-gray-500 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
            <h1 className="text-xl font-medium dark:text-white">Stake to Become Merchant and Settler</h1>
            <div className="flex flex-row items-center gap-3">
              <Clock className="text-gray-500 w-6 h-6" />
              <span className="text-gray-500 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-gray-200 dark:border-gray-700 rounded-xl p-6 gap-4 bg-white dark:bg-gray-800">
          <div className="flex flex-row items-center gap-4">
            <span className="text-xl font-medium dark:text-white">Estimated Balance</span>
            <EyeOff className="dark:text-gray-400" />
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-row items-center gap-2">
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
              <SquareAsterisk className="text-gray-400 dark:text-gray-600" />
            </div>
            <Button
              text="Add Wallet"
              icon={circleImg}
              iconPosition="right"
              className="bg-black text-white px-3 py-2 rounded-xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
