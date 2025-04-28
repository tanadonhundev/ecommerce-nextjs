"use client";

import { usePathname, useRouter, useParams } from "next/navigation";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = params.locale as string; // สมมติใช้ [locale] อยู่ใน app router

  const changeLanguage = (newLocale: string) => {
    // 1. Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // อธิบาย:
    // path=/  คือ cookie ใช้ได้ทุกหน้า
    // max-age=31536000 คือ cookie จะอยู่ 1 ปี

    // 2. เปลี่ยนเส้นทาง
    const segments = pathname.split("/"); // เช่น ['', 'en', 'dashboard']
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <div className="flex gap-3.5">
      <button
        onClick={() => changeLanguage("en")}
        disabled={currentLocale === "en"}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("th")}
        disabled={currentLocale === "th"}
      >
        ไทย
      </button>
    </div>
  );
};

export default LanguageSwitcher;
