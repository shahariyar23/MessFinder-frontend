import BookingListing from "../../components/Booking/BookingListing";
import Payment from "../../components/Booking/Payment";

const UserDashboard = () => {
    return <div className="flex flex-col max-w-screen-xl mx-auto flex-1 w-full">
        {/* Header & Edit */}
        <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
            <p className="text-[#0d171b] text-2xl sm:text-3xl font-bold min-w-32">Profile</p>
            <p className=" cursor-pointer text-sky-500 font-bold min-w-32">Edit Profile</p>
        </div>

        {/* Profile image & name/email row */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 items-start sm:items-center">
            <div className="flex gap-4 items-center">
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 sm:min-h-32 w-24 sm:w-32"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAoi6QtnWw9C12Bg13kgMM3y_RXr7WI1F5WpHWrpVYoT-nDmvfCwyRUFH_zRvNKcahF5FKdRBPHD08BC0JxScBrK-PUq6ocjNc4dzAG3jkK36nNFN4JDRh3Fj5yOynCK-AdmG6Xrgd7xICwXMDrH4-Wd0sNZfQY-lFU9vykBbIPXubkfhRKOx294S9WEhpTs8kg30rkVw7YEtxfcf6vc8V2BsRNMy9d1yTkiHmQsnz71DY2f_y9WzpzE0gsDZoc60xhmlak7lkvi2I")',
                    }}
                />
                <div className="flex flex-col justify-center">
                    <p className="text-[#0d171b] text-lg sm:text-2xl font-bold">Olivia Bennett</p>
                    <p className="text-[#4c809a] text-sm sm:text-base font-normal">olivia.bennett@email.com</p>
                </div>
            </div>
        </div>

       

        {/* Details Grid */}
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div className="border-t border-[#cfdfe7] py-4">
                <p className="text-[#4c809a] text-sm font-normal">Full Name</p>
                <p className="text-[#0d171b] text-sm font-normal">Olivia Bennett</p>
            </div>
            <div className="border-t border-[#cfdfe7] py-4">
                <p className="text-[#4c809a] text-sm font-normal">Email</p>
                <p className="text-[#0d171b] text-sm font-normal">olivia.bennett@email.com</p>
            </div>
            <div className="border-t border-[#cfdfe7] py-4">
                <p className="text-[#4c809a] text-sm font-normal">Phone Number</p>
                <p className="text-[#0d171b] text-sm font-normal">+1-555-987-6543</p>
            </div>
            <div className="border-t border-[#cfdfe7] py-4">
                <p className="text-[#4c809a] text-sm font-normal">Address</p>
                <p className="text-[#0d171b] text-sm font-normal">456 Maple Avenue, Anytown</p>
            </div>
        </div>

        {/* Booking History */}
        <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Booking History</h2>
        <div className="p-4">
           <BookingListing />
        </div>

        {/* Payment Records */}
        <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Payment Records</h2>
        <div className="px-4 py-3 overflow-x-auto">
            <Payment />
        </div>

        {/* Saved Listings */}
        <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Saved Listings</h2>
        <div className="p-4">
            <BookingListing />
        </div>
    </div>
        ;
}

export default UserDashboard;