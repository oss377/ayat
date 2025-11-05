"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Jane Doe",
    rating: 5,
    text: "Homely made finding our dream home a breeze! The agents were incredibly helpful and professional. We couldn't be happier with our new place.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAId-oFVkhg5Vxapbja6NWRtxVVJL_KOu7PGBhfr-r7P5z24ruuRFPcwadRX_T6PMM9r2zW4gULQzj6112sog_roasBh_Hb0cqw9_zWuj3DTa-yXSZ2CCueSWWtFHTHCoTRE5jvLrUytwunzTr6xHbSkhKCKrBAoK1ywkje7vezyQCh-rUSlJyqVzYWurJ3XThsUpESaKinZFni_7CNJm9sJK4qHp2tt26R92uElzEG3sH5B-t_Fp-Whbw2cCZuZMRnm0i4YEyuR52k",
  },
  {
    name: "John Smith",
    rating: 4.5,
    text: "The entire process was smooth and transparent. The team at Homely is knowledgeable and genuinely cares about their clients.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-tAKSveWkJUs8u_POBVjBV90P-Ql1ktTURDkDJMgvJijYHLdPczszUwfw7FWodkS4b4rVpfdQgVaTeZRvJ7ZSvP5hXY-dMzY3TqRMY8i3ISPPgwZfohtI2YLXQ9kKTcc8Y1nkgnv3tbGl9cZB_c4lNHWbAgI-43Ckrw9PAssYJWJ07pjoOpXZqeMlnJr3XuNiFybiM6tOMqmr2zkCl-Mq7SZCLiaXVLX6pydlpu1QzGzlIDJmVlqCPaBlYe47-k6OTR6xxPHXdjij",
  },
  {
    name: "Emily Johnson",
    rating: 5,
    text: "I sold my house faster than I ever thought possible, and for a great price! Highly recommend Homely's services.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlMRf_beDnMNNgGW9xbSVcAVT1bbRpyUMoYElX78wseqkrnSEqxR3tIbLoI6-zQrKtDz0zeHpfTnbqvQMJNK6B4m8HVD7Wdnz-nbgFozf8_rO7csB0jCpry9OU5WExbitXi7Z8bT4N_YvlZt3LeK4u9xfJrPE-camkEePyCzB7aHUi9NgzWBTsyBWA7fhL7j0dkZPXLpBkLG8Y4jMCVB5IM5xDVBXI0Vf6raMzK5gPMCrvDHRo3_kiuwL7Y_pXQnzPfNXn0_X6ZTLW",
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="w-full flex-shrink-0 flex justify-center px-4">
              <div className="max-w-2xl w-full bg-background-light dark:bg-background-dark rounded-2xl shadow-xl p-8 text-center">
                <img
                  alt={`Photo of ${t.name}`}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-primary/50"
                  src={t.img}
                />
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                  {t.name}
                </p>
                <div className="flex items-center justify-center my-4">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className={`material-symbols-outlined text-2xl ${
                        j < Math.floor(t.rating)
                          ? "text-accent"
                          : j < t.rating
                          ? "text-accent"
                          : "text-gray-400"
                      }`}
                    >
                      {j < Math.floor(t.rating) || j < t.rating ? "star" : "star_half"}
                    </span>
                  ))}
                </div>
                <p className="text-lg text-subtle-light dark:text-subtle-dark italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-0 md:px-2">
        <button
          onClick={prevSlide}
          className="bg-primary/50 text-white rounded-full p-3 hover:bg-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <button
          onClick={nextSlide}
          className="bg-primary/50 text-white rounded-full p-3 hover:bg-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
        </button>
      </div>
    </div>
  );
}