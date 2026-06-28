import { urlForImage } from "./image";
import { sanityFetch } from "./live";

const SITE_PHOTOS_QUERY = `*[_type == "sitePhotos"][0]{
  hero, about, services, calculator
}`;

type RawImage = {
  asset?: { _ref?: string; _id?: string };
  alt?: string;
} | null;

type RawDoc = {
  hero?: RawImage;
  about?: RawImage;
  services?: { solar?: RawImage; battery?: RawImage; ev?: RawImage; om?: RawImage };
  calculator?: {
    solar?: RawImage;
    battery?: RawImage;
    ev?: RawImage;
    bundle?: RawImage;
  };
};

type Photo = { url: string; alt: string };

/**
 * Photos managed from the Sanity "Site photos" document. Anything an editor
 * hasn't set yet falls back to the site's existing static asset, so the page
 * never breaks before that document is filled in.
 */
const DEFAULTS = {
  about: {
    url: "/assets/webp-eden-electrical/solar-panels-flat-roof-garden.jpg",
    alt: "Completed solar panel installation on a flat roof",
  },
  services: {
    solar: {
      url: "/assets/webp-eden-electrical/solar-panels-closeup-sky-reflection-01.webp",
      alt: "Solar Panel Installation",
    },
    battery: {
      url: "/assets/webp-eden-electrical/foxess-inverter-battery-brick-wall-02.jpg",
      alt: "Battery Storage",
    },
    om: {
      url: "/assets/webp-eden-electrical/sunsynk-inverter-battery-system.jpg",
      alt: "O&M for Solar",
    },
  },
  calculator: {
    solar: "/assets/calc-solar.jpg",
    battery: "/assets/calc-battery.jpg",
    ev: "/assets/calc-ev.jpg",
    bundle: "/assets/calc-bundle.jpg",
  },
} as const;

function photo(
  raw: RawImage | undefined,
  width: number,
  fallback?: Photo
): Photo | undefined {
  const built = urlForImage(raw);
  if (!built) return fallback;
  return { url: built.width(width).fit("max").auto("format").url(), alt: raw?.alt || fallback?.alt || "" };
}

function background(raw: RawImage | undefined, width: number, fallback: string) {
  const built = urlForImage(raw);
  return built ? built.width(width).fit("max").auto("format").url() : fallback;
}

export type SitePhotos = {
  /** No fallback applied — the homepage merges this with its existing hero image. */
  hero?: string;
  about: Photo;
  services: {
    solar: Photo;
    battery: Photo;
    ev?: Photo;
    om: Photo;
  };
  calculator: {
    solar: string;
    battery: string;
    ev: string;
    bundle: string;
  };
};

export async function getSitePhotos(): Promise<SitePhotos> {
  let data: RawDoc | null = null;
  try {
    const result = await sanityFetch({ query: SITE_PHOTOS_QUERY });
    data = result.data as RawDoc | null;
  } catch {
    data = null;
  }

  return {
    hero: urlForImage(data?.hero)?.width(1200).fit("max").auto("format").url(),
    about: photo(data?.about, 960, DEFAULTS.about)!,
    services: {
      solar: photo(data?.services?.solar, 960, DEFAULTS.services.solar)!,
      battery: photo(data?.services?.battery, 960, DEFAULTS.services.battery)!,
      ev: photo(data?.services?.ev, 960),
      om: photo(data?.services?.om, 960, DEFAULTS.services.om)!,
    },
    calculator: {
      solar: background(data?.calculator?.solar, 1600, DEFAULTS.calculator.solar),
      battery: background(data?.calculator?.battery, 1600, DEFAULTS.calculator.battery),
      ev: background(data?.calculator?.ev, 1600, DEFAULTS.calculator.ev),
      bundle: background(data?.calculator?.bundle, 1600, DEFAULTS.calculator.bundle),
    },
  };
}
