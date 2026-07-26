import { randomUUID } from "node:crypto";

const categories = [
  { key: "photographer", label_en: "Photographer", label_kh: "អ្នកថតរូប", icon: "Camera" },
  { key: "salon", label_en: "Salon", label_kh: "សាឡន", icon: "Scissors" },
  { key: "food_service", label_en: "Food Service", label_kh: "សេវាកម្មអាហារ", icon: "UtensilsCrossed" },
  { key: "hotel", label_en: "Hotel", label_kh: "សណ្ឋាគារ", icon: "Hotel" },
  { key: "honeymoon", label_en: "Honeymoon", label_kh: "ការធ្វើដំណើរកម្សាន្ត", icon: "Plane" },
  { key: "decoration", label_en: "Decoration", label_kh: "តុបតែង", icon: "Flower2" },
];

export default {
  vendor_categories: categories.map((category) => ({
    category_id: randomUUID(),
    ...category,
    active: true,
  })),
};
