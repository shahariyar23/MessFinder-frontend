import { Link } from 'react-router';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="flex flex-1 justify-center py-8 px-4 md:px-20">
      <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
        <div className="mb-3">
          <div className="p-0 sm:p-4">
            <div
              className="w-full bg-center find-image bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-slate-50 min-h-[160px] sm:min-h-[218px] rounded-none sm:rounded-xl"
            ></div>
          </div>
        </div>
        <h2 className="text-[#0d171b] text-2xl sm:text-[28px] font-bold leading-tight px-2 sm:px-4 text-center pb-3 pt-5">
          Oops! The Mess You're Looking For is Missing
        </h2>
        <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-2 sm:px-4 text-center">
          We couldn't find the page you were looking for. It seems like the mess you were searching for has gone missing.
          Don't worry, we're here to help you find your way back.
        </p>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 flex-wrap px-2 sm:px-4 py-3 max-w-[480px] justify-center">
            <button
              className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#13a4ec] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] grow"
            >
              <Link to='/' className="truncate">Back to Home</Link>
            </button>
            <button
              className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7eff3] text-[#0d171b] text-sm font-bold leading-normal tracking-[0.015em] grow"
            >
              <Link to={-1} className="truncate">Search Again</Link>
            </button>
          </div>
        </div>
        <p className="text-[#4c809a] text-sm font-normal leading-normal pb-3 pt-1 px-2 sm:px-4 text-center underline">
          Or, if you need assistance, contact us.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
