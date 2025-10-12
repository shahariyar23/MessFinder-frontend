const BookingListing = () => {
    return (
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                    
                    <div className="p-4">
                        <div className="flex items-stretch justify-between gap-4 rounded-lg">
                            <div className="flex flex-[2_2_0px] flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Completed</p>
                                    <p className="text-[#0d171b] text-base font-bold leading-tight">Mess at 123 Main Street</p>
                                    <p className="text-[#4c809a] text-sm font-normal leading-normal">123 Main Street, Anytown</p>
                                </div>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#e7eff3] text-[#0d171b] text-sm font-medium leading-normal w-fit"
                                >
                                    <span className="truncate">View Details</span>
                                </button>
                            </div>
                            <div
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBrQhl2DeZIrexYV9mdOC3Tw0qaG0BitYtbMB51l7Ud9gRMTtBjaR6bw8nGYKdlRNv5wZZIsm10T7oWYaflM_jnGGwHTXnUjADtZTsJuyKbjdWP2siKbDYcMmdtxmlui_7DdbpBor41_09ztH1JQxEd9FuA5mAZhEFxDtfhvd66zThL2CIgtk33fcEmwHOxS8EdepHVjpGbJWQSbhfDYrN1REHMSrVP0N6bZr6EwivYMVtWoCDuQoF_VpH1d8S439O9QtKUYsJsqg")' }}
                            ></div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-stretch justify-between gap-4 rounded-lg">
                            <div className="flex flex-[2_2_0px] flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#4c809a] text-sm font-normal leading-normal">Completed</p>
                                    <p className="text-[#0d171b] text-base font-bold leading-tight">Mess at 456 Oak Avenue</p>
                                    <p className="text-[#4c809a] text-sm font-normal leading-normal">456 Oak Avenue, Anytown</p>
                                </div>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-[#e7eff3] text-[#0d171b] text-sm font-medium leading-normal w-fit"
                                >
                                    <span className="truncate">View Details</span>
                                </button>
                            </div>
                            <div
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFFBC10dtNCZ4GQAcKLzzhdFwhN_AWCdJL2PJmqGwh6rVHxkPbZvIB8Im2rJru6hCZEnK975WfdYeddbH5yVQZO1kX9YQicKrQXRAHjN1oZh3XT2s7UmxufmvydwD4QBIdetj9NXxw9FIof9u8hDR5l6JD-NCz5-SIanRpwZC9DlVFgwm-x58fnjqC5Vftz4MrzrG5tjwO3tfOACZPwectOYumiJO69Y2y-BG4aVX_X0yj9-NuvHDPpbkciyw4rxRzVq7eLzADDoU")' }}
                            ></div>
                        </div>
                    </div>
                </div>
    )
    };

    export default BookingListing;