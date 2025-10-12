import CommonFrom from "@/components/Common/From";
import { contactFromControls } from "@/config/config";
import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can now use formData to send to server or handle as needed
        alert("Submitted:\n" + JSON.stringify(formData, null, 2));
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
        });
    };
    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <div className="flex min-w-72 flex-col gap-3">
                        <p className="text-[#0d171b] tracking-light text-[32px] font-bold leading-tight">Contact Us</p>
                        <p className="text-[#4c809a] text-sm font-normal leading-normal">We're here to help! Reach out to us with any questions or feedback.</p>
                    </div>
                </div>
                <div className="flex flex-col px-4 py-3">
                    <div className="w-full max-w-[480px]">
                        <CommonFrom
                            fromControls={contactFromControls}
                            fromData={formData}
                            setFromData={setFormData}
                            onSubmit={handleSubmit}
                            buttonText="Submit"
                            isButtonDisable={
                                !formData.name ||
                                !formData.email ||
                                !formData.subject ||
                                !formData.message
                            }
                        />
                    </div>
                </div>
                <h3 className="text-[#0d171b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Other Ways to Reach Us</h3>
                <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
                    <div className="text-[#0d171b] flex items-center justify-center rounded-lg bg-[#e7eff3] shrink-0 size-12" data-icon="Envelope" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[#0d171b] text-base font-medium leading-normal line-clamp-1">Email</p>
                        <p className="text-[#4c809a] text-sm font-normal leading-normal line-clamp-2">support@messfinder.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
                    <div className="text-[#0d171b] flex items-center justify-center rounded-lg bg-[#e7eff3] shrink-0 size-12" data-icon="Phone" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[#0d171b] text-base font-medium leading-normal line-clamp-1">Phone</p>
                        <p className="text-[#4c809a] text-sm font-normal leading-normal line-clamp-2">+1-555-123-4567</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
                    <div className="text-[#0d171b] flex items-center justify-center rounded-lg bg-[#e7eff3] shrink-0 size-12" data-icon="MapPin" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[#0d171b] text-base font-medium leading-normal line-clamp-1">Address</p>
                        <p className="text-[#4c809a] text-sm font-normal leading-normal line-clamp-2">123 Main Street, Anytown, CA 91234</p>
                    </div>
                </div>
                <div className="flex items-center justify-center px-4 py-3">
                    <div>
                        <iframe className="md:w-[500px] w-full rounded-lg " src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.0380363972577!2d90.3880845753402!3d23.888269878576576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c469610d01b9%3A0xaa41c726134f443b!2sIUBAT%20-%20International%20University%20of%20Business%20Agriculture%20and%20Technology!5e0!3m2!1sen!2sbd!4v1759860140600!5m2!1sen!2sbd" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact;