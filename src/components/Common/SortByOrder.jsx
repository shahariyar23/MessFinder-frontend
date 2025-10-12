import { useState } from "react";

const SortByOrder = ({ sortOptions, selected, setSelected }) => {

    return (
        <div  className="flex gap-3 p-3 flex-wrap pr-4">
                    {sortOptions.map(option => (
                        <div
                            key={option}
                            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 
            cursor-pointer transition-all
            ${selected === option
                                    ? "bg-sky-500 text-white"
                                    : "bg-[#e7eff3] text-[#0d171b] hover:bg-sky-100 hover:text-black"}`}
                             onClick={() => setSelected(option)}
                        >
                            <p className="text-sm font-medium leading-normal m-0">{option}</p>
                        </div>
                    ))}
                </div>
    )
}

export default SortByOrder;