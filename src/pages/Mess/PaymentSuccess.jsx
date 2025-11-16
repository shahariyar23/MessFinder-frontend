// components/PaymentSuccess.jsx - Minimal Version
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const tran_id = searchParams.get('tran_id');
    const status = searchParams.get('status');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-gray-600 mb-4">
                        Thank you for your payment. Your booking has been confirmed.
                    </p>
                    
                    {tran_id && (
                        <div className="bg-gray-100 rounded-lg p-3 mb-6">
                            <p className="text-sm">
                                <span className="font-medium">Transaction ID:</span>{' '}
                                <span className="font-mono">{tran_id}</span>
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button 
                            onClick={() => navigate(`/profile/${user.id}`)}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Bookings
                        </Button>
                        
                        <Button 
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="w-full"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};