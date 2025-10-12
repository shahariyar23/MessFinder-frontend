const Search = ({ value, onChange, onSubmit }) =>{
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
            ></path>
          </svg>
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

export default Search;