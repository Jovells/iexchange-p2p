import React from 'react'
import Button from '../ui/Button'
import Image from 'next/image'
import { getImage } from '@/lib/utils'

const Verify = () => {

  const kycImg = getImage("export.svg")
    return (
      <div className="flex flex-col-reverse lg:flex-row border border-gray-500 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 w-full lg:w-auto">
        <div className="flex flex-col justify-start items-start gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium dark:text-white">Verify Your Account</h1>
            <p className="text-gray-500 dark:text-white max-w-[300px]">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremquelauda
            </p>
          </div>

          <Button
            text="Proceed to KYC"
            icon={kycImg}
            iconPosition="right"
            className="bg-black text-white px-3 py-2 rounded-xl"
          />
        </div>
        <Image src="/images/icons/verify.png" alt="verify" width={139} height={139} className="flex-shrink-0" />
      </div>
    );
}

export default Verify