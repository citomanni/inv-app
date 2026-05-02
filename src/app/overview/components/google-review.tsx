"use client";

import { GoogleIcon } from "@/components/landing/Icons";
import { Check, ChevronDown, Star, StarIcon } from "lucide-react";
import React, { useState } from "react";

const GoogleReviewsSection = () => {
  const [visibleReviews, setVisibleReviews] = useState(10);

  const reviews = [
    {
      id: 1,
      name: "Strategic Marketing",
      initial: "S",
      timeAgo: "5 days ago on",
      rating: 5,
      text: "The experience was nothing short of amazing simply beautiful from beginning to end. The team was very professional and attentive to all my needs. I highly recommend Cardone Capital to anyone looking to invest in real estate",
      bgColor: "bg-gray-600",
    },
    {
      id: 2,
      name: "Ole Rubio",
      initial: "O",
      timeAgo: "1 month ago on",
      rating: 5,
      text: "I recently invested with Cardone Capital and have been pleased with the experience so far. The team was very professional and attentive to all my needs. I highly recommend Cardone Capital to anyone looking to invest in real estate.",
      bgColor: "bg-pink-500",
    },
    {
      id: 3,
      name: "Мэзрим Жан",
      initial: "M",
      timeAgo: "1 month ago on",
      rating: 5,
      text: "Очень помогли реализовать свои планы. Дружелюбные, доступно объясняют. Мастер team was very professional and attentive to all my needs. I highly recommend Cardone Capital to anyone looking to invest in real estate",
      bgColor: "bg-green-600",
    },
    {
      id: 4,
      name: "Dana Efimer",
      initial: "D",
      timeAgo: "1 month ago on",
      rating: 5,
      text: "Absolutely love the energy and vision of Cardone Capital! Everything here is on a differen team was very professional and attentive to all my needs. I highly recommend Cardone Capital to anyone looking to invest in real estate.",
      bgColor: "bg-purple-500",
    },
    {
      id: 5,
      name: "Maksim Ostrovsky",
      initial: "M",
      timeAgo: "1 month ago on",
      rating: 5,
      text: "Специалист в области инвестиций. Из множества вариантов - Выбираю лучший. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимост",
      bgColor: "bg-purple-600",
    },
    {
      id: 6,
      name: "Duff",
      initial: "D",
      timeAgo: "1 month ago on",
      rating: 5,
      text: "The Cardone Capital team have never disappointed. Friendly, attentive, professional, and. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-blue-500",
    },
    {
      id: 7,
      name: "Abby Granier",
      initial: "A",
      timeAgo: "7 months ago on",
      rating: 5,
      text: "Im giving this company 5 stars because appreciate all the things the Cardone family has to shar. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-red-500",
    },
    {
      id: 8,
      name: "Herman NC",
      initial: "H",
      timeAgo: "8 months ago on",
      rating: 5,
      text: "An awesome investing experience! I'm very satisfied. Income shows up in my account every month in a timely manner. The team is very professional and helpful. I highly recommend Cardone Capital to anyone looking to invest in real estate.",
      bgColor: "bg-yellow-700",
    },
    {
      id: 9,
      name: "Kevin De Vries",
      initial: "K",
      timeAgo: "8 months ago on",
      rating: 5,
      text: "We have invested in several funds with Grant and team. They have made the process very. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-yellow-600",
    },
    {
      id: 10,
      name: "paul aufschneider",
      initial: "p",
      timeAgo: "8 months ago on",
      rating: 5,
      text: "Cardone Capital made it easy to roll over a portion of an IRA into a self directed IRA which is now. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-pink-600",
    },
    {
      id: 11,
      name: "Sarah Johnson",
      initial: "S",
      timeAgo: "2 months ago on",
      rating: 4,
      text: "Great investment platform with excellent customer service. The returns have been consistent. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-indigo-500",
    },
    {
      id: 12,
      name: "Mike Chen",
      initial: "M",
      timeAgo: "3 months ago on",
      rating: 5,
      text: "Outstanding experience from start to finish. The team is knowledgeable and responsive. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-teal-500",
    },
    {
      id: 13,
      name: "Lisa Wong",
      initial: "L",
      timeAgo: "3 months ago on",
      rating: 5,
      text: "Highly recommend Cardone Capital. Professional service and great investment opportunities. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-orange-500",
    },
    {
      id: 14,
      name: "David Smith",
      initial: "D",
      timeAgo: "4 months ago on",
      rating: 4,
      text: "Solid investment platform with good returns. The process was smooth and well explained. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-cyan-600",
    },
    {
      id: 15,
      name: "Jennifer Lee",
      initial: "J",
      timeAgo: "4 months ago on",
      rating: 5,
      text: "Exceptional service and great investment opportunities. Very satisfied with my experience. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-rose-500",
    },
    {
      id: 16,
      name: "Robert Taylor",
      initial: "R",
      timeAgo: "5 months ago on",
      rating: 5,
      text: "Professional team and excellent investment platform. Highly recommended for serious investors. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-emerald-600",
    },
    {
      id: 17,
      name: "Maria Garcia",
      initial: "M",
      timeAgo: "6 months ago on",
      rating: 4,
      text: "Good investment experience overall. The platform is user-friendly and the support is helpful. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-violet-600",
    },
    {
      id: 18,
      name: "James Wilson",
      initial: "J",
      timeAgo: "6 months ago on",
      rating: 5,
      text: "Amazing investment opportunity with great returns. The team is professional and trustworthy. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-amber-600",
    },
    {
      id: 19,
      name: "Emma Davis",
      initial: "E",
      timeAgo: "7 months ago on",
      rating: 5,
      text: "Excellent investment platform with consistent returns. Highly recommend to anyone looking to invest. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-lime-600",
    },
    {
      id: 20,
      name: "Thomas Brown",
      initial: "T",
      timeAgo: "8 months ago on",
      rating: 4,
      text: "Great experience with Cardone Capital. Professional service and good investment opportunities. Команда Cardone Capital - это профессионалы своего дела. Очень рекомендую всем, кто хочет инвестировать в недвижимость.",
      bgColor: "bg-sky-600",
    },
  ];

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleLoadMore = () => {
    setVisibleReviews((prev) => Math.min(prev + 10, reviews.length));
  };

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
      <section className="bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 bg-center bg-cover bg-no-repeat"
       style={{
        backgroundColor: "#1c2d49",
        backgroundImage:
          "url('https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-aca49c2/cardonecapital.com/wp-content/uploads/2025/05/footer_cc.jpg')",
      }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-center sm:justify-start items-center gap-3 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <div className="flex items-center justify-center">
                <GoogleIcon/>
              </div>
              <h2 className="text-white text-2xl font-semibold">
                Excellent on Google
              </h2>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${"fill-yellow-400 text-yellow-400"}`}
                />
              ))}
            </div>
            <span className="text-white text-lg font-semibold">
              4.9 out of 5 based on 2,960 reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-8">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#FFFFFFCF] rounded-3xl p-6 shadow-lg"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 ${review.bgColor} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-semibold text-lg">
                    {review.initial}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate w-20 text-gray-900 text-sm">
                      {review.name}
                    </h3>
                    <Check size={8} color="black" strokeWidth={4} />
                  </div>
                  <p className="text-xs text-gray-500">{review.timeAgo}</p>
                </div>
              </div>

              {/* Star Rating */}
              <StarRating rating={review.rating} />

              {/* Review Text */}
              <p className="text-gray-700 text-[12px] mb-5 line-clamp-3 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreReviews && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Load More ({reviews.length - visibleReviews} remaining)
            </button>
          </div>
        )}

        {/* All loaded message */}
        {!hasMoreReviews && reviews.length > 10 && (
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">All reviews loaded</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
