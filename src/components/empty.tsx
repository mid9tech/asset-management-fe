import Image from 'next/image'
import React from 'react'

const EmptyComponent = () => {
  return (
    <div className='flex flex-col justify-center items-center h-80'>
        <Image src="/empty.png" alt="Logo" width={80} height={80} />
        <div className='text-gray'>No Data</div>
    </div>
  )
}

export default EmptyComponent