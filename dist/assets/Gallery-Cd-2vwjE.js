import{r,R as t}from"./index-DogMp12W.js";function y(){const[l,u]=r.useState([]),[i,d]=r.useState(null),a=r.useRef(null),s=r.useRef(0),c=r.useRef(0);r.useEffect(()=>{fetch("https://brown-salon-backend-production-ee4d.up.railway.app/api/gallery").then(e=>e.json()).then(e=>u(e)).catch(()=>u([]))},[]);const m=[...l,...l],f=e=>{s.current=e.touches[0].clientX,a.current&&(a.current.style.animationPlayState="paused")},p=e=>{if(!a.current)return;const n=e.touches[0].clientX-s.current;a.current.style.transform=`translateX(${c.current+n}px)`},h=e=>{if(!a.current)return;const o=e.changedTouches[0].clientX-s.current;c.current+=o,a.current.style.transform=`translateX(${c.current}px)`,a.current.style.animationPlayState="running"};return t.createElement("section",{id:"gallery",className:"py-12"},t.createElement("div",{className:"max-w-6xl mx-auto px-5 sm:px-8"},t.createElement("h2",{className:"text-3xl font-bold text-center mb-8"},"Our Gallery"),t.createElement("div",{onTouchStart:f,onTouchMove:p,onTouchEnd:h,className:"overflow-hidden cursor-grab active:cursor-grabbing"},t.createElement("div",{ref:a,className:"flex gap-3 galleryTrack w-max"},m.map((e,n)=>t.createElement("div",{key:n,className:"w-[260px] rounded-xl overflow-hidden flex-shrink-0 shadow-md"},t.createElement("img",{src:`https://brown-salon-backend-production-ee4d.up.railway.app${e==null?void 0:e.image}`,onClick:()=>d(e==null?void 0:e.image),onError:o=>o.target.style.display="none",className:"w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"}))))),l.length===0&&t.createElement("p",{className:"text-center text-gray-500 mt-6"},"No images available")),i&&t.createElement("div",{onClick:()=>d(null),className:"fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-5"},t.createElement("img",{src:`https://brown-salon-backend-production-ee4d.up.railway.app${i}`,className:"max-w-[90%] max-h-[90%] rounded-xl shadow-lg"})),t.createElement("style",null,`
        .galleryTrack {
          animation: scrollLeft 60s linear infinite;
        }

        .galleryTrack:hover {
          animation-play-state: paused;
        }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `))}export{y as default};
