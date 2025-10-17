import { useDispatch, useSelector } from "react-redux";
import BookingListing from "../../components/Booking/BookingListing";
import Payment from "../../components/Booking/Payment";
import { useEffect } from "react";
import { getStudentById } from "@/store/auth/authSlice";
import { useParams } from "react-router";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { userId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStudentById(userId));
  }, [dispatch]);
  console.log(user);
  return (
    <div className="flex flex-col max-w-screen-xl mx-auto flex-1 w-full">
      {/* Header & Edit */}
      <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
        <p className="text-[#0d171b] text-2xl sm:text-3xl font-bold min-w-32">
          Profile
        </p>
        <p className=" cursor-pointer text-sky-500 font-bold min-w-32">
          Edit Profile
        </p>
      </div>

      {/* Profile image & name/email row */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 items-start sm:items-center">
        <div className="flex gap-4 items-center">
          {/* Profile Image */}
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=0D8ABC&color=fff&size=150`
            }
            alt={user?.name}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 sm:min-h-32 w-24 sm:w-32 object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback avatar */}
          <div
            className="bg-sky-500 rounded-full min-h-24 sm:min-h-32 w-24 sm:w-32 hidden items-center justify-center"
            style={{ display: "none" }}
          >
            <span className="text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>

          {/* User Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[#0d171b] text-lg sm:text-2xl font-bold">
              {user?.name}
            </p>
            <p className="text-[#4c809a] text-sm sm:text-base font-normal">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="border-t border-[#cfdfe7] py-4">
          <p className="text-[#4c809a] text-sm font-normal">Full Name</p>
          <p className="text-[#0d171b] text-sm font-normal">{user.name}</p>
        </div>
        <div className="border-t border-[#cfdfe7] py-4">
          <p className="text-[#4c809a] text-sm font-normal">Email</p>
          <p className="text-[#0d171b] text-sm font-normal">{user.email}</p>
        </div>
        <div className="border-t border-[#cfdfe7] py-4">
          <p className="text-[#4c809a] text-sm font-normal">Phone Number</p>
          <p className="text-[#0d171b] text-sm font-normal">{user.phone}</p>
        </div>
        <div className="border-t border-[#cfdfe7] py-4">
          <p className="text-[#4c809a] text-sm font-normal">Role</p>
          <p className="text-[#0d171b] text-sm font-normal">{user.role}</p>
        </div>
      </div>

      {/* Booking History */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Booking History
      </h2>
      <div className="p-4">
        <BookingListing />
      </div>

      {/* Payment Records */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Payment Records
      </h2>
      <div className="px-4 py-3 overflow-x-auto">
        <Payment />
      </div>

      {/* Saved Listings */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Saved Listings
      </h2>
      <div className="p-4">
        <BookingListing />
      </div>
    </div>
  );
};

export default UserDashboard;
