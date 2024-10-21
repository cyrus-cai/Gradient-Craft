import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Star, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { sendTextToFeishuBot } from '@/lib/sendtoFeishu';
import { useDebounce } from 'use-debounce';
import { useToast } from "@/hooks/use-toast";

const FloatingFeedback: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [textAreaShow, setTextAreaShow] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);

    const quickTags = [
        { label: 'More colors about...', color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
        { label: 'RN Support', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
        { label: 'Flutter Support', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
        { label: 'More Framework Options...', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
        { label: 'More Export Options...', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
        { label: 'Other', color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
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

    const [debouncedRating] = useDebounce(rating, 300);

    useEffect(() => {
        if (debouncedRating !== 0) {
            sendTextToFeishuBot(debouncedRating.toString());
        }
    }, [debouncedRating, sendTextToFeishuBot]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fullFeedback = `Rating: ${rating}, Tags: ${selectedTags.join(', ')}, Custom feedback: ${feedback}`;
        try {
            await sendTextToFeishuBot(fullFeedback);
            console.log('Full feedback sent to Feishu');
            toast({
                title: "Insight Received",
                description: "Thank you for sharing feedback.",
                duration: 1500,
                className: "rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-50 text-green-900",
            });
            setFeedback('');
            setRating(0);
            setSelectedTags([]);
            setIsOpen(false);
        } catch (error) {
            console.error('Error sending full feedback to Feishu:', error);
            toast({
                title: "Error",
                description: "Failed to send feedback. Please try again.",
                duration: 3000,
                className: "rounded-xl bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-900 text-red-900 dark:text-red-100",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickTag = (tag: string) => {
        setSelectedTags(prev => {
            const newTags = prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag];

            if (tag === 'More colors about...' || tag === 'More Export Options...' || tag === 'Other' || tag === 'More Framework Options...') {
                setTextAreaShow(true);
            }

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
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 15, stiffness: 100 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-96 transition-all duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-serif font-semibold text-gray-800 dark:text-gray-100">How would you rate this experience?</h3>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl">
                            <div>
                                <div className="flex justify-start">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 transition-colors duration-200"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${(hoveredRating || rating) >= star
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                    } transition-colors duration-200`}
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <p className='font-serif text-black/50 dark:text-white/50'>And I want...</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {quickTags.map((tag, index) => (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => handleQuickTag(tag.label)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`${tag.color} text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag.label) ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-opacity-60' : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        {tag.label}
                                    </motion.button>
                                ))}
                            </div>
                            <AnimatePresence>
                                {textAreaShow && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Share your profound thoughts..."
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300 text-gray-900 dark:text-gray-100 rounded-xl resize-none transition-all duration-300"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isSubmitting}
                                className={`w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 transition-all duration-300 ease-in-out shadow-lg flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Share Insight
                                        <Send className="ml-2 w-5 h-5" />
                                    </span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300 ease-in-out p-4 relative"
                    >
                        <MessageSquare className="w-6 h-6" />
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 10 }}
                            className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1"
                        >
                            <Sparkles className="w-3 h-3 text-purple-700" />
                        </motion.span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingFeedback;