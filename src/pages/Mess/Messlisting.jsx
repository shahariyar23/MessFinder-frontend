import Search from "@/components/Common/Seach";
import SortByOrder from "@/components/Common/SortByOrder";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router";

const Messlisting = () => {
    const [selected, setSelected] = useState("Price");
    console.log(selected);
    const sortOptions = ["Price", "Date", "Rating"];

      const [search, setSearch] = useState("");
  const handleSearch = query => {
    alert(`Searching for: ${query}`);
    // You can call API/filter here
    window.location.reload();
  };



    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#0d171b] tracking-light text-[32px] font-bold leading-tight min-w-72">Mess Listings</p></div>
                    <div className="px-4 py-3">
                        <Search value={search} onChange={setSearch} onSubmit={handleSearch}/>
                       
                    </div>
                {/* sort by */}
                <h3 className="text-[#0d171b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Sort By</h3>
                <div className="flex gap-3 p-3 flex-wrap pr-4">
                <SortByOrder sortOptions={sortOptions} selected={selected} setSelected={setSelected}/>
                </div>
                {/* mess listing */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-3">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                        >
                            <img className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EJUmbU4tx7l_bhm2-TCKh2-6ywNmNKDWiEBfu7FmfUn1_Wf8mmg8Ax8YUSeInjq5j3dHuk-suK48Yd_yQzQpQ7UJdanNWcR9IJueDPZMDQe6tR1GZFKiiR1BriueE0jcnELZIO_kKxSRKbA-kf9EC9kx12ZauB5ZmldPM-78yVbjiSEYs1qnWj2O_CbH5IWVwOSNgmHo76BMga4ua0Ex--BDC-uFSty6gmF7wp-TRpx_n6bqTIkbBEwWOdDR1gn9EvOuAU7lQU" alt="" />
                        </div>
                        <div>
                            <p className="text-[#0d171b] text-base font-medium leading-normal">Cozy Mess in Downtown</p>
                            <p className="text-[#4c809a] text-sm font-normal leading-normal">A comfortable mess with essential amenities, perfect for students.</p>
                        </div>
                    </div>
                </div>
                <div className="flex px-4 py-3 justify-center">
                    <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#13a4ec] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                        <span className="truncate">View Details</span>
                    </button>
                </div>
            </div>
            {/* if user is owner they can only view this page */}
            <div>
                <Link to="/mess/add">   
                    <Button variant="nav">Add Mess </Button>
                </Link>
            </div>
        </div>
    );
}

export default Messlisting;