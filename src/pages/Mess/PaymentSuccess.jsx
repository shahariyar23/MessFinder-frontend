// components/PaymentSuccess.jsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Share2, Home, BookOpen, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';
import { useSelector } from 'react-redux';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth)
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [error, setError] = useState(null);
    const [hasReloaded, setHasReloaded] = useState(false);

    const tran_id = searchParams.get('tran_id');
    const timeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Auto reload after 1.5 seconds on first visit
    useEffect(() => {
        if (!hasReloaded && !paymentData && !error) {
            timeoutRef.current = setTimeout(() => {
                if (isMountedRef.current) {
                    console.log('🔄 Auto-reloading page to sync payment status...');
                    window.location.reload();
                    setHasReloaded(true);
                }
            }, 1500);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [hasReloaded, paymentData, error]);

    const autoConfirmPayment = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/payment/auto-confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    transactionId: tran_id
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Auto-confirm failed:', error);
            return false;
        }
    };

    const verifyPayment = async (isRetry = false) => {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

        if (!tran_id) {
            setError('No transaction ID found');
            setLoading(false);
            return;
        }

        try {
            if (!isRetry) {
                setLoading(true);
                setError(null);
            }
            
            console.log(`🔄 Verifying payment (Attempt ${retryCount + 1})...`);

            // First, try to auto-confirm the payment on first attempt only
            if (retryCount === 0) {
                const autoConfirmSuccess = await autoConfirmPayment();
                console.log('Auto-confirm success:', autoConfirmSuccess);
            }

            // Then verify payment status - REMOVED CUSTOM HEADERS
            const timestamp = new Date().getTime(); // For cache busting
            const response = await fetch(
                `http://localhost:8000/api/v1/payment/validate/${tran_id}?t=${timestamp}`,
                { 
                    credentials: 'include'
                    // Removed problematic headers
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            console.log('Payment verification response:', result);
            
            if (result.success) {
                console.log('Payment data:', result.data);
                
                if (result.data.paymentStatus === 'paid') {
                    setPaymentData(result.data);
                    setLoading(false);
                    console.log('✅ Payment verified successfully');
                } else {
                    // Payment not confirmed yet
                    if (retryCount < 2) {
                        console.log('❌ Payment not confirmed, retrying...');
                        
                        // Use ref for timeout to prevent multiple timeouts
                        timeoutRef.current = setTimeout(() => {
                            if (isMountedRef.current) {
                                setRetryCount(prev => prev + 1);
                                verifyPayment(true);
                            }
                        }, 3500);
                    } else {
                        // After max retries, show the page anyway with current status
                        setPaymentData(result.data);
                        setLoading(false);
                        console.log('ℹ️ Showing page with current payment status');
                    }
                }
            } else {
                setError(result.message || 'Payment verification failed');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            if (retryCount < 1) {
                timeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                        setRetryCount(prev => prev + 1);
                        verifyPayment(true);
                    }
                }, 1500);
            } else {
                setError('Failed to verify payment. Please check your connection.');
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // Only run verification once when component mounts
        if (tran_id && !paymentData && !error) {
            verifyPayment();
        }
    }, [tran_id]); // Only depend on tran_id

    const handleRetry = () => {
        // Clear any existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        setRetryCount(0);
        setError(null);
        setPaymentData(null);
        setHasReloaded(false); // Reset reload flag for retry
        setLoading(true);
        verifyPayment();
    };

const generateReceiptPDF = () => {
    setDownloading(true);
    
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Simple and clean design
        doc.setFillColor(34, 197, 94);
        doc.rect(0, 0, pageWidth, 60, 'F');
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('MessFinder', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('PAYMENT RECEIPT', pageWidth / 2, 35, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Receipt: ${tran_id}`, pageWidth / 2, 47, { align: 'center' });
        
        let yPosition = 75;
        
        // Payment Information
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.text('Payment Information', 20, yPosition);
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const sections = [
            {
                title: 'Payment Details',
                data: [
                    ['Transaction ID', tran_id],
                    ['Payment Date', new Date().toLocaleDateString()],
                    ['Payment Method', paymentData?.paymentMethod?.toUpperCase() || 'SSLCOMMERZ'],
                    ['Status', 'PAID']
                ]
            },
            {
                title: 'Booking Information',
                data: [
                    ['Mess Name', paymentData?.messName || 'Mostak Shahariyar'],
                    ['Check-in Date', paymentData?.checkInDate ? new Date(paymentData.checkInDate).toLocaleDateString() : '30/10/2025'],
                    ['Booking Status', (paymentData?.bookingStatus || 'confirmed').toUpperCase()]
                ]
            },
            {
                title: 'Tenant Information',
                data: [
                    ['Name', paymentData?.customerName || 'Mostak'],
                    ['Email', paymentData?.customerEmail || 'mostak420@gmail.com'],
                    ['Phone', paymentData?.customerPhone || '01761208866']
                ]
            }
        ];
        
        sections.forEach(section => {
            doc.setFontSize(11);
            doc.setTextColor(34, 197, 94);
            doc.setFont('helvetica', 'bold');
            doc.text(section.title, 20, yPosition);
            yPosition += 7;
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            
            section.data.forEach(([label, value]) => {
                doc.text(`${label}:`, 20, yPosition);
                doc.text(value, 80, yPosition);
                yPosition += 6;
            });
            
            yPosition += 5;
        });
        
        // Amount Summary
        yPosition += 5;
        doc.setDrawColor(34, 197, 94);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
        doc.text('Amount Summary', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Monthly Rent: BDT ${paymentData?.monthlyRent || '5000'}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Advance Months: ${paymentData?.advanceMonths || '1'} month(s)`, 20, yPosition);
        yPosition += 6;
        doc.text(`Advance Amount: BDT ${paymentData?.amount || '2000'}`, 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(12);
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Paid: BDT ${paymentData?.amount || '2000'}`, 20, yPosition);
        
        // Footer
        yPosition += 20;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('This is a computer-generated receipt. No signature is required.', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        doc.text('Thank you for choosing MessFinder!', pageWidth / 2, yPosition, { align: 'center' });
        
        const fileName = `MessFinder-Receipt-${tran_id}.pdf`;
        doc.save(fileName);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate receipt. Please try again.');
    } finally {
        setDownloading(false);
    }
};

    const handleDownloadReceipt = () => {
        generateReceiptPDF();
    };

    const handleShareBooking = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Booking Confirmed - MessFinder',
                text: `I just booked a mess through MessFinder! Transaction ID: ${tran_id}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Booking link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">
                        {retryCount > 0 ? 'Confirming Payment...' : 'Verifying Your Payment'}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {retryCount > 0 
                            ? `Processing... (Attempt ${retryCount + 1}/3)`
                            : 'Please wait while we confirm your payment...'
                        }
                    </p>
                    {!hasReloaded && (
                        <p className="text-sm text-blue-500 mt-2">
                            Page will reload automatically to sync payment status...
                        </p>
                    )}
                    {tran_id && (
                        <p className="text-sm text-gray-400 mt-2">
                            Transaction: {tran_id}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Payment Processing
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error}
                    </p>
                    {tran_id && (
                        <p className="text-sm text-gray-500 mb-4">
                            Transaction ID: {tran_id}
                        </p>
                    )}
                    <div className="flex gap-3 justify-center">
                        <Button 
                            onClick={handleRetry}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Again
                        </Button>
                        <Button 
                            onClick={() => navigate(`/profile/${user.id}`)}
                            variant="outline"
                        >
                            View Bookings
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                paymentData?.paymentStatus === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                                {paymentData?.paymentStatus === 'paid' ? (
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                ) : (
                                    <RefreshCw className="w-12 h-12 text-yellow-600 animate-spin" />
                                )}
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            {paymentData?.paymentStatus === 'paid' ? 'Payment Successful!' : 'Payment Processing'}
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-2">
                            {paymentData?.paymentStatus === 'paid' 
                                ? 'Thank you for your payment. Your booking has been confirmed.'
                                : 'Your payment is being processed. This may take a few moments.'
                            }
                        </p>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 text-left">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-700">Transaction ID:</span>
                                    <p className="text-gray-600 font-mono">{tran_id}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Amount Paid:</span>
                                    <p className="text-gray-600">BDT {paymentData?.amount || '0'}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Booking Status:</span>
                                    <p className="text-gray-600 capitalize">{paymentData?.bookingStatus || 'pending'}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Payment Status:</span>
                                    <p className={`font-medium capitalize ${
                                        paymentData?.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {paymentData?.paymentStatus || 'pending'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                            <Button 
                                onClick={() => navigate(`/profile/${user.id}`)}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                View Bookings
                            </Button>
                            
                            {paymentData?.paymentStatus === 'paid' && (
                                <>
                                    <Button 
                                        onClick={handleDownloadReceipt}
                                        disabled={downloading}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        {downloading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                Download Receipt
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button 
                                        onClick={handleShareBooking}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="mt-6">
                            <Button 
                                onClick={() => navigate('/')}
                                variant="ghost"
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                {paymentData?.paymentStatus === 'paid' && (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-xs font-bold">1</span>
                                    </div>
                                    <p>You will receive a confirmation email with booking details</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-xs font-bold">2</span>
                                    </div>
                                    <p>Contact the mess owner for check-in instructions</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-600 text-xs font-bold">3</span>
                                    </div>
                                    <p>Keep your transaction ID and receipt for future reference</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};