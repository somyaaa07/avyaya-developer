// import Link from "next/link";
// import { FiArrowRight } from "react-icons/fi";
// import PropertyCard from "./PropertyCard";
// import { getLatestProperties } from "@/lib/properties";

// export default async function FeaturedProperties({ limit = 6 }) {
//   const properties = await getLatestProperties(limit);

//   return (
//     <section
//       className="bg-white py-16 sm:py-20 lg:py-24"
//       aria-labelledby="featured-heading"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
//           <div className="max-w-2xl">
//             <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2e5d42]">
//               Featured Properties
//             </span>
//             <h2
//               id="featured-heading"
//               className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#1b2b23]"
//             >
//               Our Latest Properties
//             </h2>
//             <p className="mt-3 text-base text-[#66736c]">
//               Hand-picked residential, commercial and plotting opportunities,
//               updated regularly by our team.
//             </p>
//           </div>

//           <Link
//             href="/properties"
//             className="group hidden shrink-0 items-center gap-2 rounded-xl border border-[#2e5d42] px-6 py-3 text-sm font-semibold text-[#2e5d42] transition hover:bg-[#2e5d42] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2 sm:inline-flex"
//           >
//             View All Properties
//             <FiArrowRight
//               className="transition-transform group-hover:translate-x-1"
//               aria-hidden="true"
//             />
//           </Link>
//         </div>

//         {/* Grid / empty state */}
//         {properties.length > 0 ? (
//           <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {properties.map((property, i) => (
//               <PropertyCard key={property.id} property={property} index={i} />
//             ))}
//           </div>
//         ) : (
//           <div className="mt-10 rounded-2xl border border-dashed border-[#dce5df] bg-[#f0f4f1] px-6 py-14 text-center">
//             <p className="text-base font-semibold text-[#1b2b23]">
//               New properties are coming soon.
//             </p>
//             <p className="mt-1 text-sm text-[#66736c]">
//               Contact our team to know about upcoming projects.
//             </p>
//           </div>
//         )}

//         {/* Mobile button */}
//         <Link
//           href="/properties"
//           className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2e5d42] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2 sm:hidden"
//         >
//           View All Properties
//           <FiArrowRight aria-hidden="true" />
//         </Link>
//       </div>
//     </section>
//   );
// }

import React from 'react'

function FeaturedProperties() {
  return (
    <div>FeaturedProperties</div>
  )
}

export default FeaturedProperties