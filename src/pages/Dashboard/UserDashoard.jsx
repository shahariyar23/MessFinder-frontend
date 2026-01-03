import { useDispatch, useSelector } from "react-redux";
import Payment from "../../components/Booking/Payment";
import { useEffect, useState } from "react";
import { getStudentById } from "@/store/auth/authSlice";
import { useParams } from "react-router";
import SaveMess from "@/components/Booking/SaveMess";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { userId } = useParams();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: user?.email,
        phone: user?.phone
    });
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStudentById(userId));
    }, [dispatch, userId]);
console.log(user, "user")
    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsEditDialogOpen(false);
        // Reset form data to original user data
        if (user) {
            setFormData({
                name: user.name || ""
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        setLoading(true);

        try {
            // // Dispatch update action
            // await dispatch(updateStudentProfile({
            //     userId: user._id,
            //     updateData: formData
            // })).unwrap();

            // Close dialog on success
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col max-w-screen-xl mx-auto flex-1 w-full px-2 sm:px-4 md:px-6">
            {/* Header & Edit */}
            <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
                <p className="text-[#0d171b] text-2xl sm:text-3xl font-bold min-w-32">
                    Profile
                </p>
                <button 
                    onClick={handleEditClick}
                    className="cursor-pointer text-sky-500 font-bold min-w-32 hover:text-sky-600 transition-colors"
                >
                    Edit Profile
                </button>
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
                    <p className="text-[#0d171b] text-sm font-normal">{user?.name}</p>
                </div>
                <div className="border-t border-[#cfdfe7] py-4">
                    <p className="text-[#4c809a] text-sm font-normal">Email</p>
                    <p className="text-[#0d171b] text-sm font-normal">{user?.email}</p>
                </div>
                <div className="border-t border-[#cfdfe7] py-4">
                    <p className="text-[#4c809a] text-sm font-normal">Phone Number</p>
                    <p className="text-[#0d171b] text-sm font-normal">{user?.phone}</p>
                </div>
                <div className="border-t border-[#cfdfe7] py-4">
                    <p className="text-[#4c809a] text-sm font-normal">Role</p>
                    <p className="text-[#0d171b] text-sm font-normal">{user?.role}</p>
                </div>
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
            <SaveMess/>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-[#0d171b]">
                            Edit Profile
                        </DialogTitle>
                        <DialogDescription>
                            Update your profile information
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-[#0d171b]">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-[#0d171b]">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                placeholder="Enter your email"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-[#0d171b]">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                disabled
                                placeholder="Enter your phone number"
                                className="w-full"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-[#4c809a] hover:bg-[#3a677d] text-white"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserDashboard;
