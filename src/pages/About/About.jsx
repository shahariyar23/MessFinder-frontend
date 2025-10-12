import ceo from "../../assets/mostak.png";

const About = () => {
    return ( <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0d171b] tracking-light text-[32px] font-bold leading-tight">About Us</p>
                <p className="text-[#4c809a] text-sm font-normal leading-normal">
                  MessFinder is a platform dedicated to helping students find the best mess accommodations near their educational institutions. We understand the importance of
                  quality, affordable, and convenient mess services for students, and we strive to make the search process as easy and efficient as possible.
                </p>
              </div>
            </div>
            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Mission</h2>
            <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Our mission is to connect students with reliable mess providers that meet their dietary needs and preferences. We aim to create a transparent and user-friendly
              platform where students can easily compare options, read reviews, and make informed decisions about their mess arrangements.
            </p>
            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Values</h2>
            <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">
              At MessFinder, we are committed to: - **Quality:** Ensuring that all listed mess providers meet high standards of food quality and hygiene. - **Affordability:**
              Offering a range of options to suit different budgets. - **Convenience:** Providing a platform that is easy to use and navigate. - **Transparency:** Displaying
              accurate and up-to-date information about mess providers, including pricing, menus, and reviews. - **Community:** Building a community of students and mess providers
              to foster trust and collaboration.
            </p>
            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Team</h2>
            <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Our team consists of dedicated professionals with a passion for improving the student living experience. We bring together expertise in technology, food service, and
              student support to create a platform that truly meets the needs of our users.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVeUxkYAkJ1VRY2WVKhnvOPxWJffqslDDTpESCzWCVd0-Qsx7nnvg-2UxnKxvHEomHcMq-1mhdphFc-A-C-HqjWbECeLUgeLBKX_XOF326rqhmKPKhC4UvpREuwVqWE1rluYf9-91PlBq0YXtJrDplHLREhsufC2BLzia99j3d9fwAOUGxEV2JMOtIWmxnpeDj2yDXBKZNcxlGvGjIoOLVjjZTL2Cp4vpzIhgJlnY7LLYenUk7O9NzkF_By6TE6zLtSRTYVaCj3fk");'
                  >
                    <img className="w-full bg-center aspect-square rounded-full" src={ceo} alt="ceo photo" />
                  </div>
                </div>
                <div>
                  <p className="text-[#0d171b] text-base font-medium leading-normal">Mostak Shahariyar</p>
                  <p className="text-[#4c809a] text-sm font-normal leading-normal">CEO</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbpFOHQZeaivP4uW5XzUAlqm5PEOkSS1BfqWCRm9bIjDT7lvWffQXxFcGlilvjcvVV5YhhwECbR22PFckIWjwX48gHS19VTyMDoSbvjADTHS7IeP5b7Qmbjz9yvk4EaSN2Fo0YABKpwuRs-uNRr5XtADQIH8UHGhK2r9VXivofsEZMbKnk34-ni7XMANJ1k380BOf0HQHQ-yg0D2lE1OJfWQRVGATARyF3B6L3H0dNBsYXvUT_Z5Y_tueDa_lvYwnt3qydtjqmmn4");'
                  ></div>
                </div>
                <div>
                  <p className="text-[#0d171b] text-base font-medium leading-normal">Sophia Bennett</p>
                  <p className="text-[#4c809a] text-sm font-normal leading-normal">Head of Operations</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    // style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsiMRB1qe0Q9CY0JbC7vmMjX0YaWlrClhOViRqp6yaTxNUGHvxHO6t5EAmrCoUOkrUYQIE4bp3T3uVGWePJgQSIwdSTnDENjHNPeO8cK--HG5V8dHtgAfL-0d0vd8oh7ZxJbRrBQeRxaBHKmsoAnmbXVrI9gEba5eDZg7Edh7DA_ZnqWIAL_nVjHp382IZLUHdDG5nGNSRB2SMt5QNkXBpufo0eramD-chMnJoPUwxUfdPHX7ViU1A3X22_OydVH9hpCkidkClPJE");'
                  ></div>
                </div>
                <div>
                  <p className="text-[#0d171b] text-base font-medium leading-normal">Liam Harper</p>
                  <p className="text-[#4c809a] text-sm font-normal leading-normal">Head of Technology</p>
                </div>
              </div>
            </div>
            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contact Us</h2>
            <p className="text-[#0d171b] text-base font-normal leading-normal pb-3 pt-1 px-4">
              If you have any questions, feedback, or suggestions, please don't hesitate to reach out to us. You can contact us via email at support@messfinder.com or call us at
              (555) 123-4567.
            </p>
          </div>
        </div>);
};

export default About;