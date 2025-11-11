'use client';

const HorizontalScroller = () => {
  const cards = [
    { title: 'stocks' },
    { title: 'axions' },
    { title: 'shops' },
    { title: 'invest with us' },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex animate-scroll">
        {[...cards, ...cards].map((card, index) => (
          <div key={index} className="flex-shrink-0 w-56 h-36 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg flex items-center justify-center mx-4">
            <h3 className="text-xl font-bold text-white capitalize tracking-wide">{card.title}</h3>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll { animation: scroll 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default HorizontalScroller;