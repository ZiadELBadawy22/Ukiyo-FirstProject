import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import StarRating from './StarRating';

const ReviewsSection = ({ product, currentUser, userInfo, showNotification, hasPurchased }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    useEffect(() => {
        if (!product) return;
        const reviewsRef = collection(db, `products/${product.id}/reviews`);
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewsData);
            if (currentUser) {
                setHasUserReviewed(reviewsData.some(r => r.userId === currentUser.uid));
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [product, currentUser]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            showNotification("Please select a star rating.");
            return;
        }
        if (!currentUser) {
            showNotification("Please log in to leave a review.");
            return;
        }

        const reviewData = {
            userId: currentUser.uid,
            userName: userInfo?.name || currentUser.displayName || 'Anonymous',
            rating: rating,
            text: reviewText,
            createdAt: serverTimestamp(),
        };

        const reviewRef = doc(collection(db, `products/${product.id}/reviews`));
        const productRef = doc(db, `products/${product.id}`);

        try {
            await runTransaction(db, async (transaction) => {
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists()) {
                    throw "Product does not exist!";
                }

                const currentReviewCount = productDoc.data().reviewCount || 0;
                const currentAverageRating = productDoc.data().averageRating || 0;
                const newReviewCount = currentReviewCount + 1;
                const newAverageRating = ((currentAverageRating * currentReviewCount) + rating) / newReviewCount;

                transaction.set(reviewRef, reviewData);
                transaction.update(productRef, {
                    reviewCount: newReviewCount,
                    averageRating: newAverageRating
                });
            });
            showNotification("Thank you for your review!");
            setRating(0);
            setReviewText('');

        } catch (error) {
            console.error("Error submitting review: ", error);
            showNotification("Failed to submit review. Please try again.");
        }
    };

    const canReview = hasPurchased && !hasUserReviewed;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            {canReview && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="font-semibold text-lg mb-2">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="flex items-center mb-4">
                            <span className="mr-4">Your Rating:</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <button type="button" key={i} onClick={() => setRating(i + 1)}>
                                        <svg className={`h-8 w-8 cursor-pointer ${rating > i ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your thoughts..." className="w-full border-gray-300 rounded-md shadow-sm p-2" rows="4"></textarea>
                        <button type="submit" className="mt-4 py-2 px-6 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">Submit Review</button>
                    </form>
                </div>
            )}
            {hasPurchased && hasUserReviewed && <p className="text-gray-600 bg-amber-100 p-3 rounded-md mb-6">You've already reviewed this product. Thank you!</p>}
            {!hasPurchased && currentUser && <p className="text-gray-600 bg-amber-100 p-3 rounded-md mb-6">You must purchase this product to leave a review.</p>}

            {isLoading ? <p>Loading reviews...</p> : (
                reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <StarRating rating={review.rating} />
                                    <p className="ml-4 font-bold text-gray-800">{review.userName}</p>
                                </div>
                                <p className="text-gray-600">{review.text}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>No reviews yet. Be the first to write one!</p>
            )}
        </div>
    );
};

export default ReviewsSection;