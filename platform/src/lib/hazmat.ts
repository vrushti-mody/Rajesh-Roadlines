/** Hazardous goods pre-check. The list itself lives in the CMS (HazardousGoods collection). */

export type HazStatus = "accepted" | "conditional" | "refused";

export interface HazGood {
  un: string;          // "1263"
  name: string;
  hazardClass: string; // "3", "8", "2.3"
  packingGroup?: string;
  status: HazStatus;
  conditions?: string;
}

/** Classes RRPL never carries, whatever the product (company policy; edit in the CMS). */
export const DEFAULT_REFUSED_CLASSES = ["1", "6.2", "7"];

export function normaliseUn(input: string): string | null {
  const m = /^\s*(?:UN|NA)?\s*-?\s*(\d{4})\s*$/i.exec(input);
  return m ? m[1] : null;
}

export interface HazCheck {
  found: boolean;
  status: HazStatus | "unknown";
  good?: HazGood;
  message: string;
  documents: string[];
}

export const HAZ_DOCUMENTS = [
  "MSDS (16-section Safety Data Sheet) for each product",
  "TREM card (Transport Emergency card) carried in the cab",
  "Class label and UN number on every package",
  "UN-approved packaging suited to the packing group",
  "Driver with a hazardous-goods endorsement on the licence (arranged by RRPL)",
];

export function checkHazmat(query: string, list: HazGood[], refusedClasses = DEFAULT_REFUSED_CLASSES): HazCheck {
  const un = normaliseUn(query);
  const q = query.trim().toLowerCase();
  const good = un
    ? list.find((g) => g.un === un)
    : q.length >= 3 ? list.find((g) => g.name.toLowerCase().includes(q)) : undefined;

  if (!good) {
    return {
      found: false,
      status: "unknown",
      message: un
        ? `UN${un} is not on our list yet. Send the MSDS and our hazmat desk will confirm before you book.`
        : "Enter a 4-digit UN number (e.g. 1263) or a product name.",
      documents: HAZ_DOCUMENTS,
    };
  }
  const classRefused = refusedClasses.includes(good.hazardClass) || refusedClasses.includes(good.hazardClass.split(".")[0]);
  const status: HazStatus = classRefused ? "refused" : good.status;
  const message =
    status === "refused" ? `We do not carry UN${good.un} ${good.name} (class ${good.hazardClass}).`
    : status === "conditional" ? `We carry UN${good.un} ${good.name} with conditions: ${good.conditions ?? "ask the hazmat desk"}.`
    : `We carry UN${good.un} ${good.name} (class ${good.hazardClass}${good.packingGroup ? ", PG " + good.packingGroup : ""}) in packs.`;
  return { found: true, status, good, message, documents: status === "refused" ? [] : HAZ_DOCUMENTS };
}
