import React from 'react';
import './tailwind.css';
import activityGreen from './media/activity green.png';
import arrow from './media/arrow.png';

function Dashboard() {

  return (
      <div className="bg-[#2C2C39] w-screen flex flex-grow">
          <div className="ml-[10vw] mt-[5vh] flex border-2 flex-col items-center gap-y-1 max-h-[60vh] overflow-y-scroll">
              <span className="text-white text-[2rem]">WVI's</span>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => <div className="flex flex-col relative bg-[#262739]">
                  <span className="text-white ml-[121px] mr-[50px]">GK-MRB-01</span>
                  <div className="flex items-center">
                      <span className="text-white ml-[20px]">Status:</span>
                      <span className="text-white ml-[50px]"> Auto</span>
                      <img className="ml-[15px]" src={activityGreen} alt="" width="10" height="10" />
                  </div>
                  <div>
                      <span className="text-white ml-[20px]">Alarm:</span>
                      <span className="text-white ml-[50px]"> Geen</span>
                  </div>
                  <button className="absolute self-end left[100%] top-[20px]" onClick={() => { }}><img src={arrow} alt="" width="40" height="40" /></button>
              </div>) }          
          </div>
    </div>
  );
}

export default Dashboard;
