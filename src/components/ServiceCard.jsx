import React from "react";
import { Clock3, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ServiceImage({ service }) {
  const imageSrc = service.image || null;

  if (!imageSrc) {
    return (
      <div className="h-24 rounded-lg bg-gradient-to-br from-amber-100 to-orange-50 border border-amber-200/70 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-amber-500" />
      </div>
    );
  }

  return (
    <div className="relative h-24 rounded-lg overflow-hidden border border-amber-100">
      <img
        src={imageSrc}
        alt={service.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width="300"
        height="140"
      />
    </div>
  );
}

export default function ServiceCard({ service }) {
  return (
    <article className="group rounded-xl border border-amber-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-3 flex flex-col">
      <ServiceImage service={service} />

      <h3 className="mt-2.5 font-semibold text-sm text-gray-900 leading-snug line-clamp-1">
        {service.title}
      </h3>

      <p className="text-xs text-gray-500 mt-1 flex-1 leading-relaxed line-clamp-2">
        {service.description}
      </p>

      <span className="mt-2 inline-block w-fit text-[9px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
        {service.category}
      </span>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-amber-100 bg-[#FBF6EE] px-2.5 py-2">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] text-amber-700">
            <Clock3 className="w-3 h-3" />
            30 mins
          </div>

          <div className="font-bold text-base text-gray-900 mt-0.5">
            ₹{service.price}
          </div>
        </div>

        <Link
          to={`/services/${service._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold whitespace-nowrap hover:bg-gray-800 transition-colors"
        >
          Book
          <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}
