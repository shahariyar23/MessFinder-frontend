import CommonFrom from "@/components/Common/From";
import { messSearchControls } from "@/config/config";
import React, { useState } from "react";
import { Outlet } from "react-router";

const Mess = () => {
  const [formData, setFormData] = useState({
    location: "",
    budget: null,
    wifi: false,
    meals: false,
    laundry: false,
    roomType: "",
    gender: "",
    advanceRequired: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Searching! " + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="flex flex-1 items-center justify-center px-10 min-h-screen bg-gradient-to-br from-[#e7eff3] to-[#b4e0fb]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl mt-10 mb-10 p-6 md:p-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mb-2">
          Find Your Perfect Mess Accommodation
        </h1>
        <p className="text-center text-[#4c809a] mb-6 text-sm">
          Filter by location, price, amenities & more!
        </p>
        <CommonFrom
          fromControls={messSearchControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Search"
          isButtonDisable={
            !formData.location || !formData.roomType || !formData.gender || !formData.advanceRequired
          }
        />
      </div>
      <Outlet/>
    </div>
  );
};

export default Mess;
