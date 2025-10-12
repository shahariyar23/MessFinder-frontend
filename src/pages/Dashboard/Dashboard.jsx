import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [location, setLocation] = useState("");
    const handleSubmit = (e) => {
    e.preventDefault();
    // You can fetch mess listings based on the location here
    alert(`Searching mess near: ${location}`);
    setLocation('');
  };

    return (
         <div className="px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
             <div className="mb-8">
          <div className="p-4">
            <div
              className="flex min-h-[320px] md:min-h-[480px] hero-border flex-col gap-6 md:gap-8 rounded-lg items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            >
              <div className="flex flex-col gap-2 text-center">
                <h1
                  className="text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]"
                >
                  Find Your Perfect Mess Accommodation
                </h1>
                <h2 className="text-white text-sm md:text-base font-normal leading-normal">
                  Discover a wide range of mess options tailored to your needs and preferences. Enjoy delicious, home-style meals and a comfortable living experience.
                </h2>
              </div>
              {/* Search Form */}
              <form className="flex flex-col min-w-40 w-full max-w-[480px]" onSubmit={handleSubmit}>
                <div className="flex w-full items-stretch rounded-lg h-12 md:h-16 overflow-hidden">
                  <div className="text-[#4c809a] flex border border-[#cfdfe7] bg-slate-50 items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="form-input flex-1 border-t border-b border-[#cfdfe7] bg-slate-50 text-[#0d171b] px-4 text-sm md:text-base focus:outline-0"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="min-w-[84px] bg-[#13a4ec] text-white font-bold px-4 md:px-5 border border-[#cfdfe7] rounded-r-lg"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Mess Listings</h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 px-4 py-10">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-50">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnvkl8EZ9R4UQopb1eEvivyKud4M4xP1Pm-geQOOnbq64vfH7k46F7QJGCcPNWA4I0p60ulVg628tQB2Xexnnb4ncvIsMBU0dRhHWBxXdomk8mvZY27mnk1xJgo6Zz9tHnkPQTDeCmBezWUCFCzWxqbjh3kMGUlb6oGt-o-cM7-R_6HVK4gQT6QlAvRx9Kjn1-upV7YDDafUCK4wHa64csgnyglNaeRt6wngay5Chk3z4z-poYpP8DsQ669sqhpkkJDCgf2RE8ZxU");'
                  ></div>
                  <div>
                    <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Home Mess</p>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Experience the warmth of home-cooked meals in a friendly environment.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-50">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAaQM7CMzJXAFt6OpBMBlAf1EqOgLH8Ay4USfd-8loB6PSuSo2MJ_lsUFCMnwSPuwddRWSr-zqf-ODfLX5Za3P86JcRer7QhOD2j-3z5wI4tvN-KPocqO3MY5QjuKcVb6PguGmGTvSKQ630bgwGl3AZVx2Mki4zGfVdseZs1RrsL40Agy6A46mDYAXZ6S_kFUqx9T8r6Op598faLsOPo2ohFfKt410av7bBGp6OP5EIsvyrNPxQVigZuLaeen5tlkvwNgH1gdzKPws");'
                  ></div>
                  <div>
                    <p className="text-[#0d171b] text-base font-medium leading-normal">Modern Kitchen Mess</p>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Enjoy meals prepared in a state-of-the-art kitchen with a focus on hygiene.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-50">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex flex-col"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPScL1eNMJ7h3zVBgZ8aD_I8SJ_DfIp9RWO3RlVD8CmUxM6ySzmFVdBGgRj4rWDtgi8gRQ3xbYrUwZLN1DFrG_WVPdqvsSQ9eskYRChuHwcy9_6Hj1lDqDpIRb0L64766EIcpmCl290JiE9-ObmO9dtG-3iuVP1J9E5eG80ePaxgX6RcVnu3jk3jhnrBnM9EXoNMgJBw9dldk4nv8IFyTg04UXOq9MYRv1XPLQ6BmK-E0ZJCxcrXbwfryN8vr3ucwZ0yEYxwfGdDM");'
                  ></div>
                  <div>
                    <p className="text-[#0d171b] text-base font-medium leading-normal">Community Dining Mess</p>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Connect with fellow students over delicious meals in a vibrant setting.</p>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[#0d171b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  Why Choose MessFinder?
                </h1>
                <p className="text-[#0d171b] text-base font-normal leading-normal max-w-[720px]">
                  We simplify the process of finding the perfect mess accommodation, ensuring a comfortable and convenient experience for students.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#cfdfe7] bg-slate-50 p-4 flex-col">
                  <div className="text-[#0d171b]" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#0d171b] text-base font-bold leading-tight">Extensive Listings</h2>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Browse through a wide selection of mess options across various locations.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#cfdfe7] bg-slate-50 p-4 flex-col">
                  <div className="text-[#0d171b]" data-icon="House" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#0d171b] text-base font-bold leading-tight">Quality Assurance</h2>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">We carefully vet each listing to ensure quality and reliability.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#cfdfe7] bg-slate-50 p-4 flex-col">
                  <div className="text-[#0d171b]" data-icon="UsersThree" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#0d171b] text-base font-bold leading-tight">Community Reviews</h2>
                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Read reviews from other students to make informed decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Dashboard;