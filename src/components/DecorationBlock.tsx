import { useState } from 'react';

interface DecorationItem {
  domain?: string;
  pics: string[];
  txts: string[];
}

interface DecorationBlockProps {
  items: DecorationItem[];
  currentDomain?: string;
}

export function DecorationBlock({ items, currentDomain }: DecorationBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = currentDomain
    ? items.filter((item) => item.domain === currentDomain)
    : items.filter((item) => !item.domain);

  const displayItems = filteredItems.length > 0 ? filteredItems : items.filter((item) => !item.domain);

  if (displayItems.length === 0) return null;

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const currentItem = displayItems[currentIndex];

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100">
      <div className="relative aspect-video md:aspect-[21/9]">
        {currentItem.pics.map((pic, i) => (
          <img
            key={i}
            src={pic}
            alt={currentItem.txts[0] || ''}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
        ))}

        {currentItem.txts.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p className="text-white font-medium text-lg">{currentItem.txts[0]}</p>
            {currentItem.txts[1] && (
              <p className="text-white/80 text-sm mt-1">{currentItem.txts[1]}</p>
            )}
          </div>
        )}

        {displayItems.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
