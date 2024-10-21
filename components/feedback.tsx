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
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [textAreaShow, setTextAreaShow] = useState(false)
    const { toast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    const quickTags = [
        { label: 'More colors about...', color: 'bg-blue-900' },
        { label: 'RN Support', color: 'bg-green-900' },
        { label: 'Flutter Support', color: 'bg-cyan-900' },
        { label: 'More Framework Options...', color: 'bg-yellow-900' },
        { label: 'More Export Options...', color: 'bg-white/15' },
        { label: 'Other', color: 'bg-gray-900' },
    ];

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
        const fullFeedback = `Rating: ${rating}, Tags: ${selectedTags.join(', ')}, Custom feedback: ${feedback}`;
        sendTextToFeishuBot(fullFeedback)
            .then(() => {
                console.log('Full feedback sent to Feishu');
                toast({
                    title: "Insight Received",
                    description: "Thank you for sharing feedback.",
                    duration: 1500,
                    className: "rounded-xl",
                });
                setFeedback('');
                setRating(0);
                setSelectedTags([]);
                setIsOpen(false);
            })
            .catch(error => {
                console.error('Error sending full feedback to Feishu:', error);
                toast({
                    title: "Error",
                    description: "Failed to send feedback. Please try again.",
                    duration: 3000,
                    className: "rounded-xl",
                    variant: "destructive",
                });
            });
    };

    const handleQuickTag = (tag: string) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag];

            // Show textarea for specific tags
            if (tag === 'More colors about...' || tag === 'More Export Options...' || tag === 'Other' || tag === 'More Framework Options...') {
                setTextAreaShow(true);
            }

            // Silent send
            sendTextToFeishuBot(`Tag ${prev.includes(tag) ? 'deselected' : 'selected'}: ${tag}`)
                .then(() => console.log('Tag selection sent silently'))
                .catch(error => console.error('Error sending tag selection:', error));

            return newTags;
        });
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            ref={containerRef}
        >
            {isOpen ? (
                <div className="bg-gradient-to-br from-amber-900/15 via-white-800/25 to-amber-900/10 rounded-2xl shadow-2xl p-6 w-96 transition-all duration-300 ease-in-out animate-fadeIn backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-amber-100">How would you rate this experience?</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-amber-300 hover:text-amber-100 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl">
                        <div>
                            <div className="flex justify-start">
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
                        <div className="flex flex-wrap gap-2 mb-4">
                            {quickTags.map((tag, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleQuickTag(tag.label)}
                                    className={`${tag.color} text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag.label) ? 'ring-1' : 'opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                        {textAreaShow && <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your profound thoughts..."
                            className="w-full p-3 border-amber-600 focus:ring-amber-500 focus:border-amber-500 bg-amber-800/25 placeholder-amber-400 text-white rounded-2xl"
                        />}
                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white-100 font-semibold py-2 px-4 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
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