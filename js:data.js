// 机场数据库模型
const dbAirports = [
    { name: "北京首都国际机场", nameEn: "Beijing Capital International Airport", icao: "ZBAA", iata: "PEK", city: "Beijing", type: "4F", elevation: "35m", runways: [{id: "18L/36R", len: "3800m"}, {id: "18R/36L", len: "3499m"}, {id: "01/19", len: "3800m"}] },
    { name: "北京大兴国际机场", nameEn: "Beijing Daxing International Airport", icao: "ZBAD", iata: "PKX", city: "Beijing", type: "4F", elevation: "30m", runways: [{id: "17L/35R", len: "3800m"}, {id: "17R/35L", len: "3800m"}, {id: "11L/29R", len: "3800m"}, {id: "01L/19R", len: "3400m"}] },
    { name: "上海浦东国际机场", nameEn: "Shanghai Pudong International Airport", icao: "ZSPD", iata: "PVG", city: "Shanghai", type: "4F", elevation: "4m", runways: [{id: "15L/33R", len: "4000m"}, {id: "16R/34L", len: "3800m"}, {id: "15R/33L", len: "3400m"}, {id: "16L/34R", len: "3800m"}] },
    { name: "广州白云国际机场", nameEn: "Guangzhou Baiyun International Airport", icao: "ZGGG", iata: "CAN", city: "Guangzhou", type: "4F", elevation: "15m", runways: [{id: "02L/20R", len: "3800m"}, {id: "02R/20L", len: "3800m"}, {id: "01/19", len: "3800m"}] },
    { name: "成都天府国际机场", nameEn: "Chengdu Tianfu International Airport", icao: "ZUTF", iata: "TFU", city: "Chengdu", type: "4F", elevation: "442m", runways: [{id: "01/19", len: "4000m"}, {id: "02/20", len: "3800m"}, {id: "11/29", len: "3200m"}] }
];

// 航空器技术资料库
const dbAircraft = {
    "C919": {
        mfg: "COMAC", model: "C919", category: "Narrow-body Airliner",
        length: "38.90 m", wingspan: "35.80 m", height: "11.95 m",
        mtow: "71,500 kg (Std) / 78,900 kg (ER)", oew: "42,100 kg",
        speed: "Mach 0.785", range: "4,075 km - 5,555 km",
        engine: "CFM International LEAP-1C (x2)", pax: "158 - 192", source: "COMAC Official Specs (Ref)"
    },
    "C909": {
        mfg: "COMAC", model: "C909 (ARJ21)", category: "Regional Jet",
        length: "33.46 m", wingspan: "27.28 m", height: "8.44 m",
        mtow: "40,500 kg", oew: "24,955 kg",
        speed: "Mach 0.78", range: "2,225 km - 3,700 km",
        engine: "GE CF34-10A (x2)", pax: "78 - 90", source: "COMAC Official Specs (Ref)"
    },
    "A320neo": {
        mfg: "Airbus", model: "A320neo", category: "Narrow-body Airliner",
        length: "37.57 m", wingspan: "35.80 m", height: "11.76 m",
        mtow: "79,000 kg", oew: "42,600 kg",
        speed: "Mach 0.82", range: "6,300 km",
        engine: "CFM LEAP-1A / PW1100G (x2)", pax: "150 - 180", source: "Airbus Tech Data"
    },
    "B737-800": {
        mfg: "Boeing", model: "737-800", category: "Narrow-body Airliner",
        length: "39.47 m", wingspan: "34.32 m", height: "12.55 m",
        mtow: "79,010 kg", oew: "41,413 kg",
        speed: "Mach 0.78", range: "5,436 km",
        engine: "CFM56-7B (x2)", pax: "162 - 189", source: "Boeing Tech Data"
    }
};