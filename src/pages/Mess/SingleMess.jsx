import MessGallery from "@/components/Common/MessGallery ";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast, Bounce } from 'react-toastify';

const SingleMess = () => {
    const handelRequest = () => {
        toast.info('Request Sent! Owner will contact you soon.');
    };
    // Example data (replace with your props, API, etc.)
const images = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQQzQsVGWnD_km6oYFqE5k-fObvwRyP97M6yJESjONh0nfcm6Wz_5yZ1E-kSyJ9blmyWDqPiZBT81iE8I6PyDg0AbBKtspiPt-DF8jH9XL1_su0w0uYCNguRNijgK59w0FWpYqp8opwhwEvNM_wQtuqJoj93eFne81U_w6zq3i0Aas9hZIVZpcJi_e3b6Pz5Lkeqp8IauBS9GsTq66xQh8UE1EoBSn3SCX0chUs_ukxRQD64kFPfd_T4-ITVumEYrHgaAs8oCCYOY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCBWnrUagMm4wiNxo6KZ-uYUVq5NE77wvjOD0ogNfPo9ggOnroVAGIM8wehwCt3v_PpbfI5xUeb6BvZSf5RlHaFdRbZLe1MsSl2KcebnKjuu4q1aPXovESeU6I4Mtq3I6q8qx6ygkTj-7gq-sszAPCPzExQ5YJY-0eG9sgcsS_JLnQ8ea-FgmhC7GcPetn_e6czdeNzaHNJ_73he3fDPXgurwTDeYmBmbLvhhyuzQFclKnHZIoNBwkd5dQRkAfud8InNuU955EWXCk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBCROmjl-VMrgNMVI1c5oTnEB4Pz6ZQP5IIkjy7J7jRIZkiIZuIvb2uF69babigi-AIkPQCdUfpYm6ynJYNWFNrMvPo3m0Uzcqg4RWYIY1qJBtkLXKmbvKABZv23Uxnrffcz-uD4cuhdZqQMUkabtrgznsHR6B3VIiZ1id4MXQ1-FW3nM_wsaYg1twE7saoFu4iOwtO26vlRXgHfT2iqLpBPjzCsyqPdRSbdCw9ty4cB06oQgxV8fiiVH-TgUddgzCABXpZjqr2dwA"
];

const locationMap = "https://lh3.googleusercontent.com/aida-public/AB6AXuCKoWTSpmOapEoHYTpS2Yeczx2HU775H1G1Bous999g5FZyqEQ1w_ccfEEPyDNeYTnIbwD2-jNRYe40iYCB48vRcQ5zPD88aJczCV8lJFVbhj51YwSPSDTGgyY225U01PgpBOjerw2F8tDjrYqLwWr0k2PdLbGDybP5liJRU_KsYh2YyVoEkmyGmGyYQVhpwWT3nFDlGO7J0h4heVg1yibB2bTltx6JCCE_jLSEN3v67-HGPfIpO1nwBX64u4GGDf_cJ9Blne3dNiM";

    return(
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5 bg-[#f7f8fa] min-h-screen">
      <div className="layout-content-container flex flex-col max-w-[960px] w-full">
        <h1 className="text-[#0d171b] mt-4 mb-2 text-[32px] font-bold leading-tight">Cozy Corner Mess</h1>
        <div className="flex w-full grow bg-slate-50 p-4 rounded-lg mb-6">
          <MessGallery images={images} />
        </div>
        <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">About Cozy Corner Mess</h2>
        <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">
          Cozy Corner Mess offers a homely atmosphere with delicious, nutritious meals prepared with fresh, locally sourced ingredients. We cater to students' dietary needs,
          offering vegetarian, vegan, and non-vegetarian options. Our mess is known for its cleanliness, friendly staff, and timely service. We also organize occasional social
          events to foster a sense of community among our members.
        </p>
        <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Location</h2>
        <div className="flex px-4 py-3">
          <img
            src={locationMap}
            alt="Location Map"
            className="w-full aspect-video object-cover rounded-lg bg-gray-200"
            loading="lazy"
          />
        </div>
        <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Availability</h2>
        <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">Slots Available: 5</p>
        <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Owner Contact</h2>
        <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">Owner: Ms. Priya Sharma</p>
        <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">Phone: +91-9876543210</p>
        {/* Reviews and Ratings can be added similarly as shown above, reusing the grid and flex structures */}
      
      <div className="flex flex-row items-center justify-around gap-2">
        <Button className="w-1/2" variant="nav">Book Now</Button>
        <Button className="w-1/2" onClick={handelRequest} variant="nav">Request to view mess</Button>
      </div>
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
        
    )
}


export default SingleMess;