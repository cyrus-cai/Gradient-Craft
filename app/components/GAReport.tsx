// import { useEffect, useState } from 'react';

// import NumberTicker from "@/components/ui/number-ticker";

// interface AnalyticsResponse {
//     rows?: Array<{
//         dimensionValues: Array<{ value: string }>;
//         metricValues: Array<{ value: string }>;
//     }>;
// }

// export default function GAReport() {
//     const [totalUsers, setTotalUsers] = useState<number>(0);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchAnalyticsData = async () => {
//         try {
//             const response = await fetch('/api/analytics', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     dateRanges: [
//                         {
//                             startDate: '2024-10-20',
//                             endDate: 'today',
//                             name: '0',
//                         },
//                     ],
//                     dimensions: [
//                         {
//                             name: 'date',
//                         },
//                     ],
//                     metrics: [
//                         {
//                             name: 'activeUsers',
//                         },
//                     ],
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result: AnalyticsResponse = await response.json();

//             const total = result.rows?.reduce((acc, row) =>
//                 acc + (parseInt(row.metricValues[0].value) || 0), 0) || 0;

//             setTotalUsers(total);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAnalyticsData();

//         // Set up auto-refresh every 5 minutes
//         const intervalId = setInterval(fetchAnalyticsData, 5 * 60 * 1000);

//         // Cleanup interval on component unmount
//         return () => clearInterval(intervalId);
//     }, []);

//     return (
//         <div className="p-4">
//             {error && (
//                 <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//                     Error: {error}
//                 </div>
//             )}

//             <div className="flex items-center justify-center">
//                 <div className="mt-4">
//                     {loading ? (
//                         <div className="text-gray-500">Loading...</div>
//                     ) : (
//                         <div className='flex items-end'>
//                             <div className="whitespace-pre-wrap text-5xl font-medium tracking-tighter text-black dark:text-white">
//                                 <NumberTicker value={totalUsers} />
//                             </div>
//                             <p className='text-2xl'>People Used</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// import { Alert, AlertDescription } from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';

import NumberTicker from "@/components/ui/number-ticker";

interface AnalyticsResponse {
    rows?: Array<{
        dimensionValues: Array<{ value: string }>;
        metricValues: Array<{ value: string }>;
    }>;
}

export default function GAReport() {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalyticsData = async () => {
        try {
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRanges: [
                        {
                            startDate: '2024-10-20',
                            endDate: 'today',
                            name: '0',
                        },
                    ],
                    dimensions: [{ name: 'date' }],
                    metrics: [{ name: 'activeUsers' }],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AnalyticsResponse = await response.json();
            const total = result.rows?.reduce((acc, row) =>
                acc + (parseInt(row.metricValues[0].value) || 0), 0) || 0;

            setTotalUsers(total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
        const intervalId = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center relative">

            <div className="flex flex-col items-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                        <div className="h-8 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-5xl font-serif font-medium tracking-tighter text-gray-900 dark:text-gray-100 leading-none">
                            <NumberTicker value={totalUsers} />
                        </div>
                        <p className="text-2xl font-serif text-gray-500 dark:text-gray-400 tracking-wide">
                            People Used
                        </p>
                    </div>
                )}
            </div>

            {/* Optional: Add a subtle refresh indicator */}
            {/* <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-600">
                Auto-refreshes every 5 minutes
            </div> */}
        </div>
    );
}