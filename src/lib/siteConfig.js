export const siteConfig = {
  brand: import.meta.env.VITE_SITE_BRAND || "Sacramento Shuttle",

  taglineVi:
    import.meta.env.VITE_SITE_TAGLINE_VI || "Đưa đón sân bay & xe riêng",

  taglineEn:
    import.meta.env.VITE_SITE_TAGLINE_EN || "Airport transfer & private rides",

  phone: import.meta.env.VITE_SITE_PHONE || "+19160000000",

  phoneDisplay:
    import.meta.env.VITE_SITE_PHONE_DISPLAY || "(916) 000-0000",

  email: import.meta.env.VITE_SITE_EMAIL || "aungoclan@yahoo.com",

  serviceAreaVi:
    import.meta.env.VITE_SITE_SERVICE_AREA_VI || "Sacramento, California",

  serviceAreaEn:
    import.meta.env.VITE_SITE_SERVICE_AREA_EN || "Sacramento, California",

  supportTextVi:
    import.meta.env.VITE_SITE_SUPPORT_TEXT_VI ||
    "Liên hệ để xác nhận lịch trình và chuyến đi",

  supportTextEn:
    import.meta.env.VITE_SITE_SUPPORT_TEXT_EN ||
    "Contact us to confirm scheduling and ride details",
};