import { NextResponse } from "next/server";

export interface Country {
  code: string;
  name: string;
}

export async function GET() {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  // ISO 3166-1 alpha-2 codes
  const codes = [
    "AF","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BH","BD","BB",
    "BY","BE","BZ","BJ","BT","BO","BA","BW","BR","BN","BG","BF","BI","CV","KH",
    "CM","CA","CF","TD","CL","CN","CO","KM","CG","CR","HR","CU","CY","CZ","DK",
    "DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR","GA",
    "GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HU","IS","IN",
    "ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW",
    "KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","MY","MV","ML",
    "MT","MH","MR","MU","MX","FM","MD","MC","MN","ME","MA","MZ","MM","NA","NR",
    "NP","NL","NZ","NI","NE","NG","NO","OM","PK","PW","PA","PG","PY","PE","PH",
    "PL","PT","QA","RO","RU","RW","KN","LC","VC","WS","SM","ST","SA","SN","RS",
    "SC","SL","SG","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SE","CH",
    "SY","TW","TJ","TZ","TH","TL","TG","TO","TT","TN","TR","TM","TV","UG","UA",
    "AE","GB","US","UY","UZ","VU","VE","VN","YE","ZM","ZW",
  ];

  const countries: Country[] = codes
    .map((code) => {
      try {
        return { code, name: regionNames.of(code) ?? code };
      } catch {
        return null;
      }
    })
    .filter((c): c is Country => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(countries);
}
