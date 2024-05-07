"use client"
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode
  } from "react-icons/fc";
import CategoryItem from "./CategoryItem";

  const iconMap = {
    "music": FcMusic,
    // "Photography": FcOldTimeCamera,
    "finans": FcSportsMode,
    "accounting": FcSalesPerformance,
    "web dev": FcMultipleDevices,
    // "Filming": FcFilmReel,
    // "Engineering": FcEngineering,
  };

export default function Categories({items}) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
         {items.map((item) => (
            <CategoryItem
            key={item._id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item._id}
            />
      ))}
    </div>
  )
}
