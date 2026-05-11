import { useMemo, useState } from "react";
import {
  FiCheck,
  FiImage,
  FiLock,
  FiMail,
  FiPhone,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useCreateCustomerRequestMutation } from "./features/customerRequests/customerRequestsApi";
import { useGetCountriesQuery } from "./features/countries/countriesApi";
import { useGetLanguagesQuery } from "./features/languages/languagesApi";
import { API_BASE_URL } from "./app/baseApi";
import {
  DEFAULT_SERVICES_USER_ID,
  useGetServicesByUserQuery,
} from "./features/services/servicesApi";

function pickTranslationName(translations, preferredCode) {
  if (!Array.isArray(translations) || translations.length === 0) return "";
  if (preferredCode) {
    const match = translations.find((t) => t?.languageCode === preferredCode);
    if (match?.name) return match.name;
  }
  const any = translations.find((t) => t?.name);
  return any?.name ?? "";
}

function pickTranslationImagePath(translations, preferredCode) {
  if (!Array.isArray(translations) || translations.length === 0) return "";
  const raw = (t) => String(t?.imageUrl ?? t?.ImageUrl ?? "").trim();
  if (preferredCode) {
    const match = translations.find((t) => t?.languageCode === preferredCode);
    const u = match ? raw(match) : "";
    if (u) return u;
  }
  for (const t of translations) {
    const u = raw(t);
    if (u) return u;
  }
  return "";
}

function getServiceDisplayName(service, preferredLanguageCode) {
  const fromSvc = pickTranslationName(
    service?.serviceTranslations,
    preferredLanguageCode,
  );
  if (fromSvc) return fromSvc;
  const fromBase = pickTranslationName(
    service?.baseServiceTranslations,
    preferredLanguageCode,
  );
  if (fromBase) return fromBase;
  return "";
}

function resolveImageSrc(imagePath) {
  const p = typeof imagePath === "string" ? imagePath.trim() : "";
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = p.startsWith("/") ? p : `/${p}`;
  return `${base}${path}`;
}

function getServiceImageUrl(service, preferredLanguageCode) {
  const fromSvc = pickTranslationImagePath(
    service?.serviceTranslations,
    preferredLanguageCode,
  );
  if (fromSvc) return resolveImageSrc(fromSvc);
  const fromBase = pickTranslationImagePath(
    service?.baseServiceTranslations,
    preferredLanguageCode,
  );
  if (fromBase) return resolveImageSrc(fromBase);
  const root = service?.imageUrl ?? service?.ImageUrl ?? "";
  return typeof root === "string" && root.trim()
    ? resolveImageSrc(root.trim())
    : "";
}

function resolveServiceUiLanguage(formLanguageCode) {
  if (formLanguageCode === "en" || formLanguageCode === "tr") {
    return formLanguageCode;
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    const primary = navigator.language.toLowerCase();
    if (primary.startsWith("en")) return "en";
    if (primary.startsWith("tr")) return "tr";
  }
  return "tr";
}

function ServiceCardImage({ url }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className="flex h-full min-h-[88px] w-full items-center justify-center bg-[#f6f8ff] text-[#1D3587]/35">
        <FiImage size={32} strokeWidth={1.25} />
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function QrCodePlaceholder() {
  return (
    <svg
      width="168"
      height="168"
      viewBox="0 0 168 168"
      role="img"
      aria-label="QR kod"
      className="rounded-2xl border bg-white p-3 shadow-sm border-(--ms-border)"
    >
      <rect x="0" y="0" width="168" height="168" fill="white" />
      <rect x="14" y="14" width="42" height="42" rx="10" fill="#1D3587" />
      <rect x="22" y="22" width="26" height="26" rx="7" fill="white" />
      <rect x="28" y="28" width="14" height="14" rx="4" fill="#1D3587" />

      <rect x="112" y="14" width="42" height="42" rx="10" fill="#1D3587" />
      <rect x="120" y="22" width="26" height="26" rx="7" fill="white" />
      <rect x="126" y="28" width="14" height="14" rx="4" fill="#1D3587" />

      <rect x="14" y="112" width="42" height="42" rx="10" fill="#1D3587" />
      <rect x="22" y="120" width="26" height="26" rx="7" fill="white" />
      <rect x="28" y="126" width="14" height="14" rx="4" fill="#1D3587" />

      {/* Dummy QR pattern */}
      <g fill="#1D3587" opacity="0.9">
        <rect x="70" y="18" width="8" height="8" rx="2" />
        <rect x="86" y="18" width="8" height="8" rx="2" />
        <rect x="78" y="30" width="8" height="8" rx="2" />
        <rect x="94" y="34" width="8" height="8" rx="2" />
        <rect x="66" y="42" width="8" height="8" rx="2" />
        <rect x="82" y="46" width="8" height="8" rx="2" />
        <rect x="98" y="50" width="8" height="8" rx="2" />

        <rect x="70" y="70" width="10" height="10" rx="2" />
        <rect x="88" y="68" width="8" height="8" rx="2" />
        <rect x="102" y="72" width="8" height="8" rx="2" />
        <rect x="64" y="86" width="8" height="8" rx="2" />
        <rect x="76" y="90" width="8" height="8" rx="2" />
        <rect x="90" y="86" width="8" height="8" rx="2" />
        <rect x="104" y="92" width="10" height="10" rx="2" />

        <rect x="70" y="114" width="8" height="8" rx="2" />
        <rect x="86" y="112" width="8" height="8" rx="2" />
        <rect x="100" y="118" width="8" height="8" rx="2" />
        <rect x="66" y="130" width="10" height="10" rx="2" />
        <rect x="82" y="134" width="8" height="8" rx="2" />
        <rect x="98" y="140" width="8" height="8" rx="2" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [countryId, setCountryId] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createCustomerRequest, { isLoading, error }] =
    useCreateCustomerRequestMutation();
  const {
    data: countriesResponse,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useGetCountriesQuery();
  const {
    data: languagesResponse,
    isLoading: isLanguagesLoading,
    isError: isLanguagesError,
  } = useGetLanguagesQuery();
  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useGetServicesByUserQuery(DEFAULT_SERVICES_USER_ID);

  const serviceUiLanguage = useMemo(
    () => resolveServiceUiLanguage(languageCode),
    [languageCode],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Devam etmek için koşulları kabul etmelisiniz.");
      return;
    }

    const body = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      age:
        age === ""
          ? 0
          : Math.min(130, Math.max(0, Number.parseInt(String(age), 10) || 0)),
      status: 0,
      countryId,
      customerId: "00000000-0000-0000-0000-000000000000",
      userId: "20fc20b5-eedd-4883-b66e-f3f30f9dace3",
      message,
      languageCode,
      serviceIds: selectedServiceIds,
    };

    try {
      await createCustomerRequest(body).unwrap();
      setIsSuccessOpen(true);
      setSelectedServiceIds([]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      setCountryId("");
      setGender("");
      setAge("");
      setLanguageCode("");
      setAcceptTerms(false);
    } catch {
      // Hata mesajı aşağıda gösteriliyor
    }
  };

  const countries = Array.isArray(countriesResponse)
    ? countriesResponse
    : Array.isArray(countriesResponse?.data)
      ? countriesResponse.data
      : Array.isArray(countriesResponse?.items)
        ? countriesResponse.items
        : [];

  const languages = Array.isArray(languagesResponse)
    ? languagesResponse
    : Array.isArray(languagesResponse?.data)
      ? languagesResponse.data
      : Array.isArray(languagesResponse?.items)
        ? languagesResponse.items
        : [];

  const services = Array.isArray(servicesResponse)
    ? servicesResponse
    : Array.isArray(servicesResponse?.data)
      ? servicesResponse.data
      : Array.isArray(servicesResponse?.items)
        ? servicesResponse.items
        : [];

  const getCountryOption = (c) => {
    const value = c?.id ?? c?.countryId ?? c?.value ?? c?.uuid ?? c?.guid ?? "";
    const label =
      c?.name ??
      c?.title ??
      c?.countryName ??
      c?.label ??
      (typeof c === "string" ? c : "");
    return { value: String(value), label: String(label) };
  };

  const getLanguageOption = (l) => {
    const value =
      l?.code ?? l?.languageCode ?? l?.shortCode ?? l?.value ?? l?.id ?? "";
    const label =
      l?.name ??
      l?.title ??
      l?.languageName ??
      l?.label ??
      (typeof l === "string" ? l : "");
    return { value: String(value), label: String(label) };
  };

  const getServiceOption = (s) => {
    const value = s?.serviceId ?? "";
    const label = getServiceDisplayName(s, serviceUiLanguage).trim();
    return { value: String(value), label };
  };

  const activeServices = services.filter((s) => s?.isActive !== false);

  const toggleService = (id) => {
    if (!id) return;
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-white text-(--ms-ink)">
      {/* Success modal */}
      {isSuccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Başarılı"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsSuccessOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsSuccessOpen(false);
          }}
          tabIndex={-1}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg">
            <div className="ms-card overflow-hidden">
              <div className="flex items-center justify-center gap-4 border-b p-5 border-(--ms-border)">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center ">
                    <div className="text-base font-semibold tracking-tight">
                      Talebiniz alındı.
                    </div>
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl  text-(--ms-primary)">
                      <FiCheck aria-hidden color="green" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border bg-[rgba(29,53,135,0.03)] p-4 text-sm leading-6 text-(--ms-muted) border-(--ms-border)">
                  Şifreniz mail adresinize gönderildi. Mobil uygulamaya erişim
                  sağlayabilirsiniz.
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[168px_1fr] sm:items-center">
                  <div className="flex justify-center sm:justify-start">
                    <QrCodePlaceholder />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-(--ms-primary)">
                      Mobil uygulamayı indirin
                    </div>
                    <div className="mt-1 text-sm leading-6 text-(--ms-muted)">
                      QR kodu okutarak mobil uygulamamızı indirebilirsiniz.
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="ms-btn ms-btn-primary"
                        onClick={() => setIsSuccessOpen(false)}
                      >
                        Tamam
                      </button>
                      <a
                        href="#"
                        className="ms-btn ms-btn-secondary"
                        onClick={(e) => e.preventDefault()}
                      >
                        Uygulama linki
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="ms-container flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img
              src="/medsteps-logo.png"
              alt="Medsteps"
              className="h-24  object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:info@medsteps.com"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-(--ms-muted) hover:bg-[rgba(29,53,135,0.06)] sm:inline-flex"
            >
              Destek
            </a>
            <a href="#form" className="ms-btn ms-btn-primary">
              Talep Oluştur
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-[rgba(29,53,135,0.10)] blur-3xl" />
          <div className="absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[rgba(29,53,135,0.08)] blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(29,53,135,0.10)]" />
        </div>

        <div className="ms-container grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
          <div>
            <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Talebinizi dakikalar içinde oluşturun
            </h1>
            <p className="mt-4 text-pretty text-base leading-7 text-(--ms-muted)">
              Seçtiğiniz hizmeti ve iletişim bilgilerinizi paylaşın; ekibimiz en
              kısa sürede sizinle iletişime geçsin.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#form" className="ms-btn ms-btn-primary">
                Formu Doldur
              </a>
              <a
                href="#privacy"
                className="ms-btn ms-btn-secondary"
                aria-label="Gizlilik ve KVKK bilgisi"
              >
                KVKK & Gizlilik
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="ms-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-(--ms-primary)">
                  <FiShield aria-hidden />
                  Güvenli
                </div>
                <div className="mt-1 text-xs leading-5 text-(--ms-muted)">
                  Verileriniz şifreli bağlantı ile iletilir.
                </div>
              </div>
              <div className="ms-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-(--ms-primary)">
                  <FiMail aria-hidden />
                  Hızlı dönüş
                </div>
                <div className="mt-1 text-xs leading-5 text-(--ms-muted)">
                  Talebiniz ekibe anında iletilir.
                </div>
              </div>
              <div className="ms-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-(--ms-primary)">
                  <FiPhone aria-hidden />
                  Kolay iletişim
                </div>
                <div className="mt-1 text-xs leading-5 text-(--ms-muted)">
                  Telefon/E-posta ile sizi arayalım.
                </div>
              </div>
            </div>
          </div>

          {/* Banner görseli */}
          <div className="ms-card relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,53,135,0.08),rgba(29,53,135,0.02))]" />
            <div className="relative">
              <div className="p-5">
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm border-(--ms-border)">
                  <img
                    src="/images/banner.png"
                    alt="Bilgilendirme görseli"
                    className="h-[190px] w-full object-cover object-center sm:h-[250px]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ms-container pb-2">
        <div className="mx-auto w-full max-w-7xl">
          <div className="p-5">
            <img
              src="/images/roadmap.png"
              alt="Süreç akışı"
              className="max-h-[200px] w-full object-contain sm:max-h-[250px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form" className="ms-container py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="ms-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-(--ms-primary)">
                  1) Hizmet seçimi
                </div>
                <div className="mt-1 text-lg font-bold tracking-tight">
                  Lütfen ilgilendiğiniz operasyon tipini seçin
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-(--ms-muted) border-(--ms-border)">
                <FiShield aria-hidden className="text-(--ms-primary)" />
                Güvenli gönderim
              </div>
            </div>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  {isServicesLoading && (
                    <p className="mt-3 text-sm text-(--ms-muted)">
                      Hizmetler yükleniyor…
                    </p>
                  )}
                  {!isServicesLoading && isServicesError && (
                    <p className="mt-3 text-sm font-medium text-red-700">
                      Hizmetler yüklenemedi.
                    </p>
                  )}
                  {!isServicesLoading &&
                    !isServicesError &&
                    activeServices.length === 0 && (
                      <p className="mt-3 text-sm text-(--ms-muted)">
                        Gösterilecek hizmet yok.
                      </p>
                    )}
                  {!isServicesLoading &&
                    !isServicesError &&
                    activeServices.length > 0 && (
                      <div
                        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
                        role="list"
                        aria-label="Hizmetler"
                      >
                        {activeServices.map((s) => {
                          const opt = getServiceOption(s);
                          if (!opt.value) return null;
                          const label = opt.label || opt.value;
                          const imgUrl = getServiceImageUrl(
                            s,
                            serviceUiLanguage,
                          );
                          const isSelected = selectedServiceIds.includes(
                            s.serviceId,
                          );
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="listitem"
                              aria-pressed={isSelected}
                              onClick={() => toggleService(opt.value)}
                              className={`group flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:shadow-md focus-visible:outline-none ${
                                isSelected
                                  ? "border-[#1D3587] ring-2 ring-[#1D3587]/20"
                                  : "border-[rgba(29,53,135,0.16)] hover:border-[rgba(29,53,135,0.45)]"
                              }`}
                            >
                              <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-[#f6f8ff]">
                                <ServiceCardImage url={imgUrl} />
                              </div>
                              <div className="flex min-h-0 flex-1 flex-col">
                                <div className="px-3 py-3 text-xs font-semibold leading-snug text-[#1D3587]">
                                  {label}
                                </div>
                                {isSelected && (
                                  <div className="mt-auto flex items-center justify-center gap-1.5 border-t border-[rgba(29,53,135,0.18)] bg-[rgba(29,53,135,0.06)] py-2 text-[#1D3587]">
                                    <FiCheck
                                      size={16}
                                      strokeWidth={2.5}
                                      aria-hidden
                                    />
                                    <span className="text-[11px] font-semibold">
                                      Seçildi
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                </div>

                <div className="mt-2 border-t pt-5 border-(--ms-border)">
                  <div className="text-sm font-semibold text-(--ms-primary)">
                    2) İletişim bilgileri
                  </div>
                  <div className="mt-1 text-sm text-(--ms-muted)">
                    Lütfen iletişim bilgilerinizi girin.
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-(--ms-ink) sm:col-span-2">
                      Ülke
                      <select
                        className="ms-input"
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                        disabled={isCountriesLoading}
                      >
                        <option value="">
                          {isCountriesLoading
                            ? "Ülkeler yükleniyor..."
                            : isCountriesError
                              ? "Ülkeler yüklenemedi"
                              : "Ülke seçin"}
                        </option>
                        {countries.map((c) => {
                          const opt = getCountryOption(c);
                          if (!opt.value || !opt.label) return null;
                          return (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          );
                        })}
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink) sm:col-span-2">
                      Dil
                      <select
                        className="ms-input"
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        disabled={isLanguagesLoading}
                      >
                        <option value="">
                          {isLanguagesLoading
                            ? "Diller yükleniyor..."
                            : isLanguagesError
                              ? "Diller yüklenemedi"
                              : "Dil seçin"}
                        </option>
                        {languages.map((l) => {
                          const opt = getLanguageOption(l);
                          if (!opt.value || !opt.label) return null;
                          return (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          );
                        })}
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      Ad
                      <input
                        className="ms-input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Adınız"
                        autoComplete="given-name"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      Soyad
                      <input
                        className="ms-input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Soyadınız"
                        autoComplete="family-name"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      Yaş
                      <input
                        className="ms-input [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={130}
                        step={1}
                        value={age}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            setAge("");
                            return;
                          }
                          if (/^\d+$/.test(v)) setAge(v);
                        }}
                        placeholder="Yaşınız"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      Cinsiyet
                      <select
                        className="ms-input"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Cinsiyet seçin</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      E-posta
                      <input
                        className="ms-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-posta adresiniz"
                        autoComplete="email"
                      />
                    </label>

                    <label className="block text-xs font-semibold text-(--ms-ink)">
                      Telefon
                      <input
                        className="ms-input"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Telefon numaranız"
                        autoComplete="tel"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block text-xs font-semibold text-(--ms-ink)">
                    Mesajınız
                    <textarea
                      className="ms-input min-h-[96px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Kısaca ihtiyacınızı yazın"
                    />
                  </label>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border bg-[rgba(29,53,135,0.03)] p-3 text-sm text-(--ms-muted) border-(--ms-border)">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#1D3587]"
                    />
                    <span className="leading-6">
                      Üyelik koşullarını ve kişisel verilerimin korunmasını
                      kabul ediyorum.
                    </span>
                  </label>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="ms-btn ms-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading ? "Gönderiliyor..." : "Gönder"}
                      </button>
                      <button type="reset" className="ms-btn ms-btn-secondary">
                        Temizle
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                      Gönderim sırasında hata oluştu.
                    </div>
                  )}

                  <input
                    type="hidden"
                    name="serviceIds"
                    value={selectedServiceIds.join(",")}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white border-(--ms-border)">
        <div className="ms-container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/medsteps-logo.png"
              alt="Medsteps"
              className="h-7 w-auto"
            />
            <div>
              <div className="text-sm font-semibold text-(--ms-primary)">
                Medsteps
              </div>
            </div>
          </div>

          <div className="text-xs text-(--ms-muted)">
            © {new Date().getFullYear()} Medsteps. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
