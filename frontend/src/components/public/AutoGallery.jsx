import { motion } from "framer-motion";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import GallerySlide from "./GallerySlide";

// Dummy Data
const dummyGalleryData = [
  {
    id: "g1",
    title: "AI & Future Technologies Symposium",
    description: "An immersive deep dive into the next generation of generative AI models, led by industry experts and senior researchers.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2026-03-15"
  },
  {
    id: "g2",
    title: "Hackathon: Neural Networks in Action",
    description: "A 48-hour competitive coding event where students built real-world applications using modern LLMs and computer vision.",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2026-04-02"
  },
  {
    id: "g3",
    title: "Guest Lecture by Top Tech Innovators",
    description: "Leading engineers from top tech companies share their journey and insights on building robust AI architectures.",
    category: "Seminar",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2026-04-20"
  },
  {
    id: "g4",
    title: "Past Tech Fest 2025",
    description: "Annual technical festival celebrating innovations in Machine Learning and Robotics.",
    category: "Fest",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2025-05-10"
  }
];

const SwiperBlock = ({ title, data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center sm:mb-10 sm:text-left"
      >
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-teal-400">
          Department Highlights
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-[4/3] w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:aspect-[21/9]"
      >
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          speed={1000}
          loop={data.length > 1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="gallery-swiper h-full w-full rounded-3xl pb-10 sm:pb-0"
        >
          {data.map((item, index) => (
            <SwiperSlide key={item.id} className="h-full w-full">
              <GallerySlide item={item} isActive={activeIndex === index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

const AutoGallery = () => {
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = dummyGalleryData.filter((item) => item.eventDate >= today).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  const pastEvents = dummyGalleryData.filter((item) => item.eventDate < today).sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-16 sm:py-24">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.05),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SwiperBlock title="Upcoming Events" data={upcomingEvents} />
        <SwiperBlock title="Past Events & Highlights" data={pastEvents} />
      </div>

      <style jsx="true" global="true">{`
        .gallery-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
        }
        .gallery-swiper .swiper-pagination-bullet-active {
          background: #2dd4bf;
          box-shadow: 0 0 10px rgba(45, 212, 191, 0.8);
        }
        .gallery-swiper .swiper-button-next,
        .gallery-swiper .swiper-button-prev {
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .gallery-swiper .swiper-button-next:hover,
        .gallery-swiper .swiper-button-prev:hover {
          color: #fff;
          background: rgba(20, 184, 166, 0.5);
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.4);
        }
        .gallery-swiper .swiper-button-next::after,
        .gallery-swiper .swiper-button-prev::after {
          font-size: 20px;
          font-weight: 900;
        }
      `}</style>
    </section>
  );
};

export default AutoGallery;
