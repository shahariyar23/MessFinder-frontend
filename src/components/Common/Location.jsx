const Location = ({ value, onChange, onSubmit }) =>{
    return <form
    className="px-4 py-3"
    onSubmit={e => {
      e.preventDefault();
      if (onSubmit) onSubmit(value);
    }}
  >
    <label className="flex flex-col min-w-40 h-12 w-full">
      <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
        {/* Magnifying Glass Icon */}
        <div className="text-[#4c809a] flex border-none bg-[#e7eff3] items-center justify-center pl-4 rounded-l-xl border-r-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-house-icon lucide-map-pin-house"><path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/><path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/><path d="M18 22v-3"/><circle cx="10" cy="10" r="3"/></svg>
        </div>
        {/* Input with fully customized value/state */}
        <input
          type="text"
          placeholder="Search for mess listings"
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d171b] focus:outline-0 focus:ring-0 border-none bg-[#e7eff3] focus:border-none h-full placeholder:text-[#4c809a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </label>
  </form>;
}

export default Location;