'use client';
import Rank from '@/components/Cards/Rank'
import React from 'react'


const Ranking = () => {
  return (
    <div className='w-full h-[100vh] text-black'>
      <div className='h-[80%]'>
        <h1 className='text-midnight-secondary text-3xl'>Ranking</h1>
        <div className="h-[80%] p-10 md:block overflow-y-scroll px-10 scrollbar-thumb-[#413f3f] scrollbar-[#3E5C76] scrollbar-thin">
          <table className='w-full rounded-lg'>
            <thead>
              <tr className='bg-midnight-secondary'>
                <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>Rank</th>
                <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>Player</th>
                <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>Level</th>
                <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>Score</th>
              </tr>
            </thead>
            <tbody>
                <Rank />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
