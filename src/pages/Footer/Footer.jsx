import { NavLink } from "react-router"

const Footer = () => { 
    return(
        <footer className="bg-white border-t border-solid border-t-[#e7eff3]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0  pb-6">
                    {/* Brand & Socials */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <svg className="w-[20px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor"></path>
                            </svg>
                            <h2 className="text-[#0d171b] text-lg font-bold leading-tight tracking-[-0.015em]">MessFinder</h2>
                        </div>
                        <div className="flex gap-4 mt-3">
                            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 text-gray-500 hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    {/* Facebook icon or your custom SVG */}
                                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877V15.468H7.898v-2.936h2.54v-2.236c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462H15.32c-1.199 0-1.572.744-1.572 1.509v1.96h2.678l-.428 2.936h-2.25v6.409C18.343 21.128 22 16.991 22 12"></path>
                                </svg>
                            </a>
                            <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 text-gray-500 hover:text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    {/* YouTube icon or your custom SVG */}
                                    <path d="M23.498 6.186a2.968 2.968 0 0 0-2.088-2.093C19.208 3.636 12 3.636 12 3.636s-7.209 0-9.41.457A2.96 2.96 0 0 0 .502 6.186C.047 8.413.047 12 .047 12s0 3.587.455 5.814a2.968 2.968 0 0 0 2.088 2.093c2.201.457 9.41.457 9.41.457s7.209 0 9.41-.457a2.968 2.968 0 0 0 2.088-2.093c.455-2.227.455-5.814.455-5.814s0-3.587-.455-5.814zM9.545 15.568v-7.136l6.364 3.568-6.364 3.568z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5 text-gray-500 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                    {/* Twitter icon or your custom SVG */}
                                    <path d="M24 4.557a9.986 9.986 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.723 9.865 9.865 0 0 1-3.127 1.195A4.922 4.922 0 0 0 16.616 3c-2.73 0-4.945 2.214-4.945 4.945 0 .388.044.765.128 1.128C7.691 8.863 4.066 7.13 1.64 4.161c-.427.733-.671 1.58-.671 2.476 0 1.708.87 3.214 2.19 4.099a4.904 4.904 0 0 1-2.241-.619v.062c0 2.385 1.697 4.374 3.946 4.823a4.936 4.936 0 0 1-2.236.084c.631 1.966 2.463 3.393 4.634 3.433A9.868 9.868 0 0 1 0 21.542a13.945 13.945 0 0 0 7.548 2.209c9.058 0 14.009-7.509 14.009-14.009 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    {/* Footer Navigation */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
                        <NavLink to="/about" className="text-[#0d171b] text-sm font-medium leading-normal">About</NavLink>
                        <NavLink to="/contact" className="text-[#0d171b] text-sm font-medium leading-normal">Contact</NavLink>
                        <NavLink to="/privacy" className="text-[#0d171b] text-sm font-medium leading-normal">Privacy Policy</NavLink>
                        <NavLink to="/terms" className="text-[#0d171b] text-sm font-medium leading-normal">Terms of Service</NavLink>
                    </div>
                </div>
                <div className="text-center py-4 text-xs text-gray-500">
                    &copy; 2025 MessFinder. All rights reserved. | Developed by Team Alpha
                </div>
            </div>
        </footer>
    )
}

export default Footer
