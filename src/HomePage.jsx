import { useState } from "react";
import { FiGlobe, FiMenu, FiSearch, FiX } from "react-icons/fi";
import { useCreateCustomerRequestMutation } from "./features/customerRequests/customerRequestsApi";
import { useGetCountriesQuery } from "./features/countries/countriesApi";
import { useGetLanguagesQuery } from "./features/languages/languagesApi";
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

export default function HomePage() {
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [serviceSelectValue, setServiceSelectValue] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [countryId, setCountryId] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [languageCode, setLanguageCode] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      userId: "E49D497A-0107-40BB-92CD-932025E5A134",
      message,
      languageCode,
      serviceIds: selectedServiceIds,
    };

    try {
      await createCustomerRequest(body).unwrap();
      alert("Talebiniz alındı.");
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
    const label = getServiceDisplayName(s, languageCode).trim();
    return { value: String(value), label };
  };

  const activeServices = services.filter((s) => s?.isActive !== false);

  const availableServices = activeServices.filter(
    (s) => s?.serviceId && !selectedServiceIds.includes(s.serviceId),
  );

  const addServiceFromSelect = (id) => {
    if (!id) return;
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setServiceSelectValue("");
  };

  const removeSelectedService = (id) => {
    setSelectedServiceIds((prev) => prev.filter((x) => x !== id));
  };

  const getServiceById = (id) => activeServices.find((s) => s.serviceId === id);

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f2a66]">
      {/* Üst navigasyon */}
      <header className="w-full bg-white">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <div className="flex flex-col leading-none">
              <div className="text-[14px] font-bold uppercase text-[#1D3587]">
                MEDSTEPS
              </div>
              <div className="text-[15px] font-bold uppercase text-[#1f2a6b]">
                HASTANELERİMİZ
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <div className="text-[13px] font-bold uppercase text-[#1f2a6b]">
                MAYO CLINIC
              </div>
              <div className="text-[12px] font-semibold text-[#1D3587]">
                Care Network
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-[#1f2a6b] md:flex">
            <a href="#" className="hover:text-[#7c3aed]">
              HASTANELERİMİZ
            </a>
            <a href="#" className="hover:text-[#7c3aed]">
              BÖLÜMLERİMİZ
            </a>
            <a href="#" className="hover:text-[#7c3aed]">
              DOKTORLARIMIZ
            </a>
            <a href="#" className="hover:text-[#7c3aed]">
              BİZE ULAŞIN
            </a>
            <a href="#" className="hover:text-[#7c3aed]">
              KURUMSAL
            </a>
            <a href="#" className="hover:text-[#7c3aed]">
              MAYO CLINIC SAĞLIK KÜTÜPHANESİ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-[12px] font-bold text-[#1f2a6b]">
                <FiGlobe className="text-[#1f2a6b]" size={18} />
                INTERNATIONAL PATIENTS
              </span>
            </div>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6f2] text-[#1f2a6b] hover:border-[#7c3aed]/60 hover:text-[#7c3aed]"
              aria-label="Ara"
            >
              <FiSearch size={18} />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6f2] text-[#1f2a6b] hover:border-[#7c3aed]/60 hover:text-[#7c3aed]"
              aria-label="Menü"
            >
              <FiMenu size={18} />
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <div className="text-[13px] font-bold text-[#1f2a6b]">TR</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero görsel */}
      <div className="mx-auto max-w-[1920px] px-6">
        <img
          src="/images/banner.png"
          alt="Anasayfa banner"
          className="h-[470px] w-full object-cover object-top md:h-[600px]"
        />
      </div>

      {/* Banner altı metin */}
      <section className="mx-auto max-w-[1920px] px-6 pb-6 pt-2 mt-10">
        <div className="text-[20px] font-bold uppercase tracking-wide text-[#1f6bb8]">
          AMERİKAN HASTANESİ / ONLINE HİZMETLER
        </div>
        <h1 className="mt-1 text-[42px] font-extrabold leading-tight text-[#0b2f8f] sm:text-[48px] lg:text-[50px]">
          ÖN KAYIT TALEBİ
        </h1>
        <p className="mt-4 w-full text-[20px] leading-7 text-[#0f2a66]">
          Bu alandaki formu doldurarak ilgilendiğiniz operasyonla ilgili tüm
          işlemlerinizi size gönderilecek hesap bilgileri ile mobil uygulamamız
          üzerinden gerçekleştirebileceksiniz.
        </p>
      </section>

      {/* Roadmap görseli (üst bölüm birebir için) */}
      <section className="mx-auto max-w-[1920px] px-6 pb-2 mt-24">
        <img
          src="/images/roadmap.png"
          alt="Hizmet akışı"
          className="mx-auto w-full max-w-[1220px]"
        />
      </section>

      {/* Form */}
      <div className="mx-auto max-w-[1920px] px-4 pb-10 pt-6">
        <div className="rounded-2xl  bg-white p-6 ">
          <div className="text-center">
            <div className="text-[32px] font-normal  text-[#173f9c]">
              Lütfen ilgilendiğiniz operasyon tipini seçin:
            </div>
          </div>

          <form className="mt-8 w-1/2 mx-auto" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-full sm:col-span-2">
                <span className="block text-xs font-semibold text-[#1f2a6b]">
                  Hizmet seçiniz
                </span>
                <div className="mt-1 flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-lg border border-[#e0e0ef] bg-white px-2 py-2 text-sm text-[#1f2a6b] focus-within:border-[#1D3587]">
                  {selectedServiceIds.map((id) => {
                    const s = getServiceById(id);
                    const label = s
                      ? getServiceDisplayName(s, languageCode)
                      : id;
                    return (
                      <span
                        key={id}
                        className="inline-flex max-w-full items-center gap-1 rounded-md bg-[#e8eef9] pl-2 pr-1 py-0.5 text-xs font-medium text-[#1D3587]"
                      >
                        <span className="truncate">{label || id}</span>
                        <button
                          type="button"
                          className="inline-flex shrink-0 rounded p-0.5 text-[#1D3587] hover:bg-[#d4dff3]"
                          onClick={() => removeSelectedService(id)}
                          aria-label={`${label} kaldır`}
                        >
                          <FiX size={14} strokeWidth={2.5} />
                        </button>
                      </span>
                    );
                  })}
                  <select
                    value={serviceSelectValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v) addServiceFromSelect(v);
                      else setServiceSelectValue("");
                    }}
                    disabled={
                      isServicesLoading ||
                      isServicesError ||
                      availableServices.length === 0
                    }
                    aria-label="Hizmet ekle"
                    className="min-w-[min(100%,12rem)] flex-1 cursor-pointer border-0 bg-transparent py-1 pl-1 pr-6 text-sm text-[#1f2a6b] outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {isServicesLoading
                        ? "Hizmetler yükleniyor..."
                        : isServicesError
                          ? "Hizmetler yüklenemedi"
                          : availableServices.length === 0
                            ? selectedServiceIds.length > 0
                              ? "Tüm hizmetler seçildi"
                              : "Hizmet yok"
                            : "Hizmet ekleyin…"}
                    </option>
                    {availableServices.map((s) => {
                      const opt = getServiceOption(s);
                      if (!opt.value || !opt.label) return null;
                      return (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-span-full pt-2 text-center text-sm font-semibold text-[#1f2a6b]">
                Lütfen iletişim bilgilerinizi girin:
              </div>

              <label className="block w-full text-xs font-semibold text-[#1f2a6b] sm:col-span-2">
                Ülke
                <select
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed] disabled:bg-gray-50"
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

              <label className="block w-full text-xs font-semibold text-[#1f2a6b] sm:col-span-2">
                Dil
                <select
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed] disabled:bg-gray-50"
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

              <label className="block w-full text-xs font-semibold text-[#1f2a6b] sm:col-span-2">
                Cinsiyet
                <select
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Cinsiyet seçin</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </label>

              <label className="block w-full text-xs font-semibold text-[#1f2a6b]">
                Ad
                <input
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adınız"
                />
              </label>
              <label className="block w-full text-xs font-semibold text-[#1f2a6b]">
                Soyad
                <input
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                />
              </label>
              <label className="block w-full text-xs font-semibold text-[#1f2a6b] sm:col-span-1">
                Yaş
                <input
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
              <label className="block w-full text-xs font-semibold text-[#1f2a6b]">
                E-posta
                <input
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                />
              </label>
              <label className="block w-full text-xs font-semibold text-[#1f2a6b]">
                Telefon
                <input
                  className="mt-1 w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Telefon numaranız"
                />
              </label>
            </div>

            <label className="mt-4 block text-xs font-semibold text-[#1f2a6b]">
              Mesajınız
              <textarea
                className="mt-1 min-h-[90px] w-full rounded-lg border border-[#e0e0ef] bg-white px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınız"
              />
            </label>

            <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-[#3a3a5a]">
              <input type="checkbox" className=" h-4 w-4 accent-[#1D3587]" />
              <span className="text-sm text-[#3a3a5a]">
                Platformu kullanmaya devam ederek üyelik koşullarını ve kişisel
                verilerimin korunmasını kabul ediyorum.
              </span>
            </label>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-[#1D3587] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#162a69] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Gönderiliyor..." : "Gönder"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-[#dcdcf2] bg-white px-6 py-2 text-sm font-bold text-[#1f2a6b] hover:border-[#7c3aed]/60"
              >
                Tamam
              </button>
            </div>

            {error && (
              <div className="mt-3 text-center text-sm font-semibold text-red-700">
                Gönderim sırasında hata oluştu.
              </div>
            )}

            <input
              type="hidden"
              name="serviceIds"
              value={selectedServiceIds.join(",")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
