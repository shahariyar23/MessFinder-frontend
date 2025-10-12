import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

const Payment = () => {
    return (
        <Table className="min-w-full border border-[#cfdfe7] rounded-lg bg-slate-50">
            <TableHeader>
                <TableRow className="bg-slate-50">
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32 sm:w-64">Date</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32 sm:w-64">Amount</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-20">Status</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium w-20">Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="border-t border-[#cfdfe7]">
                    <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">2023-08-15</TableCell>
                    <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">$50.00</TableCell>
                    <TableCell className="h-12 px-4 py-2">
                        <button className="px-3 py-1 rounded-lg bg-[#e7eff3] text-[#0d171b] text-sm font-medium">Paid</button>
                    </TableCell>
                    <TableCell className="h-12 px-4 py-2 cursor-pointer text-[#4c809a] font-bold">View</TableCell>
                </TableRow>
                {/* Repeat for other records as needed */}
            </TableBody>
        </Table>

    )
}

export default Payment;