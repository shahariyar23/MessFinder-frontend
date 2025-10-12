import UserListing from "@/components/Users/UserListing";



export default function MessOwners() {
    // Example data
    const owners = [
        {
            name: "Ethan Harper",
            contact: "ethan.harper@email.com",
            listings: 3,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Olivia Hayes",
            contact: "olivia.hayes@email.com",
            listings: 2,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Noah Carter",
            contact: "noah.carter@email.com",
            listings: 1,
            status: "Suspended",
            statusColor: "bg-red-100",
            action: "View Profile"
        },
        {
            name: "Ava Bennett",
            contact: "ava.bennett@email.com",
            listings: 4,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Liam Foster",
            contact: "liam.foster@email.com",
            listings: 2,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Isabella Reed",
            contact: "isabella.reed@email.com",
            listings: 3,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Jackson Turner",
            contact: "jackson.turner@email.com",
            listings: 1,
            status: "Suspended",
            statusColor: "bg-red-100",
            action: "View Profile"
        },
        {
            name: "Mia Mitchell",
            contact: "mia.mitchell@email.com",
            listings: 2,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Caleb Bennett",
            contact: "caleb.bennett@email.com",
            listings: 3,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        },
        {
            name: "Chloe Foster",
            contact: "chloe.foster@email.com",
            listings: 2,
            status: "Active",
            statusColor: "bg-[#e7eff3]",
            action: "View Profile"
        }
    ];

    return (
        <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
            <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">Mess Owners</p>
            </div>
            {/* Search */}
            <UserListing users={owners} user={"Owner"} />
        </div>
    );
}
