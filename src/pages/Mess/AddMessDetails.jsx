import { useState } from "react";

export default function AddMessDetails() {
  const [fields, setFields] = useState({
    name: "",
    address: "",
    description: "",
    pricing: "",
    advance: "",
    contact: "",
  });
  const [facilities, setFacilities] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [gender, setGender] = useState("");
  const [features, setFeatures] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Input changes  
  const handleField = e => setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleCheckbox = (value, state, setState) => e =>
    setState(e.target.checked ? [...state, value] : state.filter(v => v !== value));
  const handleRadio = setter => e => setter(e.target.value);

  // Image logic: stores File[] and renders object URLs for preview
  const handleImages = e => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("You must upload exactly 3 images.");
      return;
    }
    const allFiles = [...images, ...files].slice(0, 3);
    setImages(allFiles);
    setPreviews(allFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (images.length !== 3) return alert("Please upload exactly 3 images.");
    const data = {
      ...fields,
      facilities,
      roomType,
      gender,
      features,
      // For image upload: only store files or replace this with server URLs after uploading files
      images,
    };
    // Demo: log the data. Replace with your API POST logic.
    console.log(data);
    alert("Submitted! See console for output data.");
  };

  return (
    <form className="flex flex-col max-w-[960px] mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-[#0d171b] text-[28px] font-bold text-center pb-3 pt-5">Add New Mess Details</h2>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input name="name" value={fields.name} onChange={handleField} placeholder="Property Name" className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" required />
      </div>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input name="address" value={fields.address} onChange={handleField} placeholder="Address" className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" required />
      </div>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <textarea name="description" value={fields.description} onChange={handleField} placeholder="Description" className="rounded-lg border border-[#cfdfe7] min-h-36 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" />
      </div>
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Available Facilities</h3>
      <div className="px-4">
        {["Wi-Fi", "Meals", "Laundry", "Lifts", "Water Filter", "Freezer"].map(fac => (
          <label key={fac} className="flex gap-3 py-3 items-center">
            <input
              type="checkbox"
              checked={facilities.includes(fac)}
              onChange={handleCheckbox(fac, facilities, setFacilities)}
              className="h-5 w-5 accent-[#13a4ec] border-[#cfdfe7]"
            />
            <span className="text-[#0d171b]">{fac}</span>
          </label>
        ))}
      </div>
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Room Types</h3>
      <div className="flex gap-3 p-4">
        {["Single", "Shared"].map(type => (
          <label key={type} className={`text-sm font-medium flex items-center justify-center rounded-lg border px-4 h-11 cursor-pointer border-[#cfdfe7] ${roomType === type ? "border-2 border-[#13a4ec] px-3.5" : ""}`}>
            {type}
            <input type="radio" value={type} name="roomType" checked={roomType === type} onChange={handleRadio(setRoomType)} className="absolute invisible" />
          </label>
        ))}
      </div>
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Gender Accommodation</h3>
      <div className="flex gap-3 p-4">
        {["Male", "Female"].map(type => (
          <label key={type} className={`text-sm font-medium flex items-center justify-center rounded-lg border px-4 h-11 cursor-pointer border-[#cfdfe7] ${gender === type ? "border-2 border-[#13a4ec] px-3.5" : ""}`}>
            {type}
            <input type="radio" value={type} name="gender" checked={gender === type} onChange={handleRadio(setGender)} className="absolute invisible" />
          </label>
        ))}
      </div>
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Room Features</h3>
      <div className="px-4">
        {["Master Bed", "Balcony"].map(feat => (
          <label key={feat} className="flex gap-3 py-3 items-center">
            <input
              type="checkbox"
              checked={features.includes(feat)}
              onChange={handleCheckbox(feat, features, setFeatures)}
              className="h-5 w-5 accent-[#13a4ec] border-[#cfdfe7]"
            />
            <span className="text-[#0d171b]">{feat}</span>
          </label>
        ))}
      </div>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input name="pricing" value={fields.pricing} onChange={handleField} placeholder="Pricing" className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" required />
      </div>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <select name="advance" value={fields.advance} onChange={handleField} className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full">
          <option value="">Advance Payment (Months)</option>
          <option value="1">one</option>
          <option value="2">two</option>
          <option value="3">three</option>
        </select>
      </div>
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input name="contact" value={fields.contact} onChange={handleField} placeholder="Contact Information" className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" required />
      </div>
      {/* Upload images */}
      <div className="flex flex-col p-4">
        <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#cfdfe7] px-6 py-14">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#0d171b] text-lg font-bold">Upload Photos (3 required)</p>
            <p className="text-[#0d171b] text-sm">Drag and drop or click to upload</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="hidden"
              id="mess-photos-uploader"
            />
          </div>
          <label htmlFor="mess-photos-uploader" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7eff3] text-[#0d171b] text-sm font-bold">Upload</label>
          <div className="flex gap-3 mt-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`Mess Upload ${i + 1}`} className="h-16 w-16 rounded border object-cover" />
            ))}
          </div>
          <p className="text-sm text-[#4c809a]">{images.length}/3 photos uploaded</p>
        </div>
      </div>
      <div className="flex px-4 py-3">
        <button type="submit" className="flex flex-1 items-center justify-center rounded-lg h-10 px-4 bg-[#13a4ec] text-slate-50 text-sm font-bold">
          <span className="truncate">Submit</span>
        </button>
      </div>
    </form>
  );
}
