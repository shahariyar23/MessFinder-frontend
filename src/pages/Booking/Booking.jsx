import { useState } from "react";
import CommonFrom from "@/components/Common/From";
import { bookingFromControls } from "@/config/config";
import { ToastContainer, toast, Bounce } from 'react-toastify';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const initialFormState = {
    fullName: "",
    phonenumber: "",
    checkInDate: "",
    advancePayment: "",
    paymentMethod: "",
};

const Booking = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setDialogOpen(true); // Open AlertDialog
    };

    const handleDialogContinue = () => {
        // Handle actual booking logic here, or show success, etc.
        setDialogOpen(false);
        // setFormData(initialFormState);
        toast.success('Successfully Booked!');
        // Optionally show a toast/snackbar instead
    };

    const isFormIncomplete =
        !formData.fullName ||
        !formData.phonenumber ||
        !formData.checkInDate ||
        !formData.advancePayment ||
        !formData.paymentMethod;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-[#e7eff3] to-[#b4e0fb]">
            <h1 className="text-[#0d171b] mb-6 text-2xl md:text-4xl font-bold text-center leading-tight">
                Book your Room
            </h1>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10">

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>

                    <CommonFrom
                        fromControls={bookingFromControls}
                        fromData={formData}
                        setFromData={setFormData}
                        onSubmit={handleSubmit}
                        buttonText="Book Now"
                        isButtonDisable={isFormIncomplete}
                    />

                    {/* The Dialog itself */}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Booking Info</AlertDialogTitle>
                            <AlertDialogDescription>
                                {formData.fullName && (
                                    <div className="space-y-4 text-black">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Name</span>
                                                <span className="text-right">{formData.fullName}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Phone Number</span>
                                                <span className="text-right">{formData.phonenumber}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Check-In</span>
                                                <span className="text-right">{formData.checkInDate}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Advance Payment Amount</span>
                                                <span className="text-right">{formData.advancePayment}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Payment Method</span>
                                                <span className="text-right">{formData.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </AlertDialogDescription>

                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDialogContinue}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    );
};

export default Booking;
