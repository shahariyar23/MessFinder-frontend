import {
    Book,
    BookOpen,
    Bookmark,
    CreditCard,
    User,
    Users,
    DollarSign,
    CloudCheck,
    Home,
    List,
    ListCheck,
    GitPullRequestCreateArrow,
    GitPullRequestClosed

} from "lucide-react";


export const registerFromControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "phonenumber",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "role",
    label: "Role",
    componentType: "select",
    placeholder: "Select role",
    options: [
      { id: "student", label: "Student" },
      { id: "owner", label: "Mess Owner" },
    ]
  }
];


export const loginFromControls = [
    {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    }
]

export const contactFromControls = [
{
    name: "name",
    label: "Your Name",
    placeholder: "Enter your name",
    componentType: "input",
    type: "text",
},
{    name: "email",
    label: "Your Email",
    placeholder: "Enter your email",  
    componentType: "input",
    type: "email",
},
{    name: "subject",
    label: "Subject",
    placeholder: "Enter the subject",
    componentType: "input",
    type: "text",
},
{    name: "message",
    label: "Message",
    placeholder: "Enter your message",
    componentType: "textarea",
    type: "text",
}
]

export const messSearchControls = [
  {
    name: "location",
    label: "Location or Landmark",
    placeholder: "Enter location or landmark",
    componentType: "input",
    type: "text",
  },
  {
    name: "budget",
    label: "Budget Range",
    componentType: "inpt",
    placeholder: "Enter your budget",
    type: "number",
  },
  {
    name: "wifi",
    label: "Wi-Fi",
    componentType: "checkbox",
  },
  {
    name: "lift",
    label: "Lift Service",
    componentType: "checkbox",
  },
  {
    name: "meals",
    label: "Meals Included",
    componentType: "checkbox",
  },
  {
    name: "laundry",
    label: "Laundry Service",
    componentType: "checkbox",
  },
  {
    name: "freezer",
    label: "Freezer Service",
    componentType: "checkbox",
  },
  {
    name: "waterfilter",
    label: "Water Filter Service",
    componentType: "checkbox",
  },
  {
    name: "roomType",
    label: "Room Type",
    componentType: "select",
    options: [
      { id: "single", label: "Single Room" },
      { id: "shared", label: "Shared Room" },
    ]
  },
  {
    name: "roomFeatures",
    label: "Room Features",
    componentType: "select",
    options: [
      { id: "master", label: "Master Bed Room" },
      { id: "balcony", label: "Balcony Room" },
    ]
  },
  {
    name: "gender",
    label: "Gender Preference",
    componentType: "select",
    options: [
      { id: "male", label: "Male Only" },
      { id: "female", label: "Female Only" },
      { id: "coed", label: "Co-ed" },
    ]
  },
  {
    name: "advanceRequired",
    label: "Advance Payment",
    componentType: "select",
    options: [
      { id: "0", label: "No Advance Payment" },
      { id: "1", label: "Advance Payment Required for 1 Month" },
      { id: "2", label: "Advance Payment Required for 2 Months" },
    ]
  }
];

export const bookingFromControls = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    componentType: "input",
    type: "text",
  },
  {
    name: "phonenumber",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "number",
  },
  {
    name:"checkInDate",
    label: "Check-In",
    placeholder: "Select check-in date",  
    componentType: "date",
    type: "text",
  },
  {
    name: "advancePayment",
    label: "Advance Payment Amount",
    placeholder: "Enter advance payment amount",
    componentType: "input",
    type: "number",
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    componentType: "select",
    options: [
      { id: "online", label: "Digital Payment" },
      { id: "cash", label: "Hand Cash" },
    ]
  }
];

export const sidebarLinks = [
    {
        value: "booking",
        label: "Bookings",
        icon: Book,
        iconFilled: BookOpen,
    },
    {
        value: "list",
        label: "All Messes",
        icon: List,
        iconFilled: ListCheck,
    },
    {
        value: "request",
        label: "Request Mess view",
        icon: GitPullRequestCreateArrow,
        iconFilled: GitPullRequestClosed,
    },
    {
        value: "payments",
        label: "Payments",
        icon: CreditCard,
        iconFilled: CreditCard, // Lucide doesn't provide a filled variant, so reuse
    },
    {
        value: "saved",
        label: "Saved",
        icon: Bookmark,
        iconFilled: Bookmark, // No filled variant, so reuse
    },
    {
        value: "profile",
        label: "Profile",
        icon: User,
        iconFilled: User, // No filled variant
    },
];


export const adminLinks = [
  { value: "dashboard", label: "Dashboard", icon: Home },
  { value: "mess-listings", label: "Mess Listings", icon: List },
  { value: "user-activity", label: "User Activity", icon: Users },
  { value: "owner-activity", label: "Owner Activity", icon: User },
  { value: "payments", label: "Payments", icon: DollarSign },
  { value: "approvals", label: "Approvals", icon: CloudCheck },
];
