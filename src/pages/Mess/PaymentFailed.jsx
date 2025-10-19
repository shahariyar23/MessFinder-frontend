import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorData, setErrorData] = useState(null);

    const tran_id = searchParams.get('tran_id');

    useEffect(() => {
        if (tran_id) {
            // You can fetch failure details if needed
            setErrorData({
                tran_id,
                error: 'Payment was not completed successfully'
            });
        }
    }, [tran_id]);

    const handleRetryPayment = () => {
        // Navigate back to payment page or retry logic
        navigate('/bookings');
    };

    const handleContactSupport = () => {
        // Implement contact support logic
        window.open('mailto:support@messmate.com?subject=Payment Failed&body=Transaction ID: ' + tran_id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Failure Header */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Payment Failed
                        </h1>
                        
                        <p className="text-lg text-gray-600 mb-4">
                            We couldn't process your payment. Please try again or contact support if the problem persists.
                        </p>

                        {errorData && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
                                <div className="space-y-2 text-sm">
                                    {errorData.tran_id && (
                                        <div>
                                            <span className="font-semibold text-gray-700">Transaction ID:</span>
                                            <p className="text-gray-600 font-mono">{errorData.tran_id}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-semibold text-gray-700">Error:</span>
                                        <p className="text-gray-600">{errorData.error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Common Issues */}
                        <Card className="mt-6 border border-orange-200 bg-orange-50">
                            <CardContent className="p-4 text-left">
                                <h4 className="font-semibold text-orange-800 mb-3">Common Issues:</h4>
                                <ul className="space-y-2 text-sm text-orange-700">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Insufficient funds in your account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Incorrect card details or expired card</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Network connectivity issues</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Bank server temporarily unavailable</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                            <Button 
                                onClick={handleRetryPayment}
                                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Try Again
                            </Button>
                            
                            <Button 
                                onClick={handleContactSupport}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <HelpCircle className="w-4 h-4" />
                                Contact Support
                            </Button>
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

                {/* Support Information */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600">📧</span>
                                </div>
                                <div>
                                    <p className="font-medium">Email Support</p>
                                    <p>support@messmate.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600">📞</span>
                                </div>
                                <div>
                                    <p className="font-medium">Phone Support</p>
                                    <p>+880 1XXX-XXXXXX</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-600">🕒</span>
                                </div>
                                <div>
                                    <p className="font-medium">Support Hours</p>
                                    <p>9:00 AM - 11:00 PM (Everyday)</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};