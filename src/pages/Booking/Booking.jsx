import { useRef, useState } from "react";
import CommonFrom from "@/components/Common/From";
import { bookingFromControls } from "@/config/config";
import { ToastContainer, toast, Bounce } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "@/store/mess/bookingSlice";
import { useNavigate, useParams } from "react-router";
import { Spinner } from "@/components/ui/spinner";

const initialFormState = {
  fullName: "",
  phonenumber: "",
  checkInDate: "",
  advancePayment: "",
  paymentMethod: "",
  emerName: "",
  emerNumber: "",
  relation: "",
};

const Booking = () => {
  const [formData, setFormData] = useState(initialFormState);
  const { user } = useSelector((state) => state.auth);
  const { createLoading } = useSelector((state) => state.booking);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { messId } = useParams();
  const timeoutRef = useRef(null);
  const nevigate = useNavigate()
  const dispacth = useDispatch();
  const bookingData = {
    mess_id: messId,
    checkInDate: formData?.checkInDate,
    paymentMethod: formData?.paymentMethod,
    tenantName: formData?.fullName,
    tenantPhone: formData?.phonenumber,
    tenantEmail: user?.email,
    payAbleAmount: parseInt(formData?.advancePayment),
    emergencyContact: {
      name: formData?.emerName,
      phone: formData?.emerNumber,
      relation: formData?.relation,
    },
  };



  // Clear timeout when component unmounts
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData?.emerNumber === formData?.phonenumber) {
      toast.info("Emergency Contact and you phone numner can not be same");
      return;
    }
    setDialogOpen(true);
  };

  const handleDialogContinue = () => {
    if (createLoading) {
      toast.info(<Spinner />);
    }

    dispacth(createBooking(bookingData)).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
         timeoutRef.current = setTimeout(() => {
        nevigate(`/profile/${user?.id}`);
      }, 3000);
      }else{
        toast.error(res?.payload)
      }
    });
    // Reset form if needed:
    setFormData(initialFormState);
    setDialogOpen(false);
  };

  const isFormIncomplete =
    !formData.fullName ||
    !formData.phonenumber ||
    !formData.checkInDate ||
    !formData.advancePayment ||
    !formData.paymentMethod ||
    !formData.emerName ||
    !formData.emerNumber ||
    !formData.relation;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-[#e7eff3] to-[#b4e0fb]">
      <h1 className="text-[#0d171b] mb-6 text-2xl md:text-4xl font-bold text-center leading-tight">
        Book your Room
      </h1>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10">
        {/* Form is outside the AlertDialog */}
        <CommonFrom
          fromControls={bookingFromControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Book Now"
          isButtonDisable={isFormIncomplete}
        />

        {/* AlertDialog is separate and controlled by state */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4 text-black">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Full Name
                      </span>
                      <span className="text-right">{formData.fullName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Phone Number
                      </span>
                      <span className="text-right">{formData.phonenumber}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Check-In Date
                      </span>
                      <span className="text-right">{formData.checkInDate}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Advance Payment
                      </span>
                      <span className="text-right">
                        {formData.advancePayment}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Payment Method
                      </span>
                      <span className="text-right">
                        {formData.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Please review your booking details before confirming.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDialogContinue}>
                Confirm Booking
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
