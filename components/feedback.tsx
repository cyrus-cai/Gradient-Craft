import { MessageSquare, Star, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { sendTextToFeishuBot } from '@/lib/sendtoFeishu';
import { useToast } from "@/hooks/use-toast";

const FloatingFeedback = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const { toast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rating > 0) {
            const message = `New insight received: ${rating} stars`;
            sendTextToFeishuBot(message)
                .then(() => console.log('Rating sent to Feishu'))
                .catch(error => console.error('Error sending rating to Feishu:', error));
        }
    }, [rating]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Insight shared:', { rating, feedback });
        toast({
            title: "Insight Received",
            description: "Thank you for sharing your profound thoughts.",
            duration: 3000,
        });
        setFeedback('');
        setRating(0);
        setIsOpen(false);
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            ref={containerRef}
        >
            {isOpen ? (
                <div className="bg-gradient-to-br from-amber-900/90 via-amber-800/95 to-amber-700/90 rounded-2xl shadow-2xl p-6 w-80 transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-amber-100">Reflect</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-amber-300 hover:text-amber-100 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-amber-200 mb-2">
                                How would you rate this experience?
                            </label>
                            <div className="flex justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-colors duration-200"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${(hoveredRating || rating) >= star
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-amber-700'
                                                } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your profound thoughts..."
                            className="w-full p-3 rounded-lg border-amber-600 focus:ring-amber-500 focus:border-amber-500 bg-amber-800/50 placeholder-amber-400 text-amber-100"
                        />
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-semibold py-2 px-4 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            onClick={() => { sendTextToFeishuBot(feedback.toString()) }}
                        >
                            Share Insight
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-100 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 p-4"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default FloatingFeedback;