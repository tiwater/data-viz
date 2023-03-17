import { t } from '../../src/utils/i18n';

export const getUnit = () => [
  {
    text: t('grafana-ui.utils.unit.Misc', 'Misc'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.none', 'Number'),
        value: 'none',
      },
      {
        text: t('grafana-ui.utils.unit.string', 'String'),
        value: 'string',
      },
      {
        text: t('grafana-ui.utils.unit.short', 'short'),
        value: 'short',
      },
      {
        text: t('grafana-ui.utils.unit.percent', 'Percent (0-100)'),
        value: 'percent',
      },
      {
        text: t('grafana-ui.utils.unit.percentunit', 'Percent (0.0-1.0)'),
        value: 'percentunit',
      },
      {
        text: t('grafana-ui.utils.unit.humidity', 'Humidity (%H)'),
        value: 'humidity',
      },
      {
        text: t('grafana-ui.utils.unit.dB', 'Decibel'),
        value: 'dB',
      },
      {
        text: t('grafana-ui.utils.unit.hex0x', 'Hexadecimal (0x)'),
        value: 'hex0x',
      },
      {
        text: t('grafana-ui.utils.unit.hex', 'Hexadecimal'),
        value: 'hex',
      },
      {
        text: t('grafana-ui.utils.unit.sci', 'Scientific notation'),
        value: 'sci',
      },
      {
        text: t('grafana-ui.utils.unit.locale', 'Locale format'),
        value: 'locale',
      },
      {
        text: t('grafana-ui.utils.unit.pixel', 'Pixels'),
        value: 'pixel',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Acceleration', 'Acceleration'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.accMS2', 'Meters/sec²'),
        value: 'accMS2',
      },
      {
        text: t('grafana-ui.utils.unit.accFS2', 'Feet/sec²'),
        value: 'accFS2',
      },
      {
        text: t('grafana-ui.utils.unit.accG', 'G unit'),
        value: 'accG',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Angle', 'Angle'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.degree', 'Degrees (°)'),
        value: 'degree',
      },
      {
        text: t('grafana-ui.utils.unit.radian', 'Radians'),
        value: 'radian',
      },
      {
        text: t('grafana-ui.utils.unit.grad', 'Gradian'),
        value: 'grad',
      },
      {
        text: t('grafana-ui.utils.unit.arcmin', 'Arc Minutes'),
        value: 'arcmin',
      },
      {
        text: t('grafana-ui.utils.unit.arcsec', 'Arc Seconds'),
        value: 'arcsec',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Area', 'Area'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.areaM2', 'Square Meters (m²)'),
        value: 'areaM2',
      },
      {
        text: t('grafana-ui.utils.unit.areaF2', 'Square Feet (ft²)'),
        value: 'areaF2',
      },
      {
        text: t('grafana-ui.utils.unit.areaMI2', 'Square Miles (mi²)'),
        value: 'areaMI2',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Computation', 'Computation'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.flops', 'FLOP/s'),
        value: 'flops',
      },
      {
        text: t('grafana-ui.utils.unit.mflops', 'MFLOP/s'),
        value: 'mflops',
      },
      {
        text: t('grafana-ui.utils.unit.gflops', 'GFLOP/s'),
        value: 'gflops',
      },
      {
        text: t('grafana-ui.utils.unit.tflops', 'TFLOP/s'),
        value: 'tflops',
      },
      {
        text: t('grafana-ui.utils.unit.pflops', 'PFLOP/s'),
        value: 'pflops',
      },
      {
        text: t('grafana-ui.utils.unit.eflops', 'EFLOP/s'),
        value: 'eflops',
      },
      {
        text: t('grafana-ui.utils.unit.zflops', 'ZFLOP/s'),
        value: 'zflops',
      },
      {
        text: t('grafana-ui.utils.unit.yflops', 'YFLOP/s'),
        value: 'yflops',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Concentration', 'Concentration'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.ppm', 'parts-per-million (ppm)'),
        value: 'ppm',
      },
      {
        text: t('grafana-ui.utils.unit.conppb', 'parts-per-billion (ppb)'),
        value: 'conppb',
      },
      {
        text: t('grafana-ui.utils.unit.conngm3', 'nanogram per cubic meter (ng/m³)'),
        value: 'conngm3',
      },
      {
        text: t('grafana-ui.utils.unit.conngNm3', 'nanogram per normal cubic meter (ng/Nm³)'),
        value: 'conngNm3',
      },
      {
        text: t('grafana-ui.utils.unit.conμgm3', 'microgram per cubic meter (μg/m³)'),
        value: 'conμgm3',
      },
      {
        text: t('grafana-ui.utils.unit.conμgNm3', 'microgram per normal cubic meter (μg/Nm³)'),
        value: 'conμgNm3',
      },
      {
        text: t('grafana-ui.utils.unit.conmgm3', 'milligram per cubic meter (mg/m³)'),
        value: 'conmgm3',
      },
      {
        text: t('grafana-ui.utils.unit.conmgNm3', 'milligram per normal cubic meter (mg/Nm³)'),
        value: 'conmgNm3',
      },
      {
        text: t('grafana-ui.utils.unit.congm3', 'gram per cubic meter (g/m³)'),
        value: 'congm3',
      },
      {
        text: t('grafana-ui.utils.unit.congNm3', 'gram per normal cubic meter (g/Nm³)'),
        value: 'congNm3',
      },
      {
        text: t('grafana-ui.utils.unit.conmgdL', 'milligrams per decilitre (mg/dL)'),
        value: 'conmgdL',
      },
      {
        text: t('grafana-ui.utils.unit.conmmolL', 'millimoles per litre (mmol/L)'),
        value: 'conmmolL',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Currency', 'Currency'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.currencyUSD', 'Dollars ($)'),
        value: 'currencyUSD',
      },
      {
        text: t('grafana-ui.utils.unit.currencyGBP', 'Pounds (£)'),
        value: 'currencyGBP',
      },
      {
        text: t('grafana-ui.utils.unit.currencyEUR', 'Euro (€)'),
        value: 'currencyEUR',
      },
      {
        text: t('grafana-ui.utils.unit.currencyJPY', 'Yen (¥)'),
        value: 'currencyJPY',
      },
      {
        text: t('grafana-ui.utils.unit.currencyRUB', 'Rubles (₽)'),
        value: 'currencyRUB',
      },
      {
        text: t('grafana-ui.utils.unit.currencyUAH', 'Hryvnias (₴)'),
        value: 'currencyUAH',
      },
      {
        text: t('grafana-ui.utils.unit.currencyBRL', 'Real (R$)'),
        value: 'currencyBRL',
      },
      {
        text: t('grafana-ui.utils.unit.currencyDKK', 'Danish Krone (kr)'),
        value: 'currencyDKK',
      },
      {
        text: t('grafana-ui.utils.unit.currencyISK', 'Icelandic Króna (kr)'),
        value: 'currencyISK',
      },
      {
        text: t('grafana-ui.utils.unit.currencyNOK', 'Norwegian Krone (kr)'),
        value: 'currencyNOK',
      },
      {
        text: t('grafana-ui.utils.unit.currencySEK', 'Swedish Krona (kr)'),
        value: 'currencySEK',
      },
      {
        text: t('grafana-ui.utils.unit.currencyCZK', 'Czech koruna (czk)'),
        value: 'currencyCZK',
      },
      {
        text: t('grafana-ui.utils.unit.currencyCHF', 'Swiss franc (CHF)'),
        value: 'currencyCHF',
      },
      {
        text: t('grafana-ui.utils.unit.currencyPLN', 'Polish Złoty (PLN)'),
        value: 'currencyPLN',
      },
      {
        text: t('grafana-ui.utils.unit.currencyBTC', 'Bitcoin (฿)'),
        value: 'currencyBTC',
      },
      {
        text: t('grafana-ui.utils.unit.currencymBTC', 'Milli Bitcoin (฿)'),
        value: 'currencymBTC',
      },
      {
        text: t('grafana-ui.utils.unit.currencyμBTC', 'Micro Bitcoin (฿)'),
        value: 'currencyμBTC',
      },
      {
        text: t('grafana-ui.utils.unit.currencyZAR', 'South African Rand (R)'),
        value: 'currencyZAR',
      },
      {
        text: t('grafana-ui.utils.unit.currencyINR', 'Indian Rupee (₹)'),
        value: 'currencyINR',
      },
      {
        text: t('grafana-ui.utils.unit.currencyKRW', 'South Korean Won (₩)'),
        value: 'currencyKRW',
      },
      {
        text: t('grafana-ui.utils.unit.currencyIDR', 'Indonesian Rupiah (Rp)'),
        value: 'currencyIDR',
      },
      {
        text: t('grafana-ui.utils.unit.currencyPHP', 'Philippine Peso (PHP)'),
        value: 'currencyPHP',
      },
      {
        text: t('grafana-ui.utils.unit.currencyVND', 'Vietnamese Dong (VND)'),
        value: 'currencyVND',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Data', 'Data'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.bytes', 'bytes(IEC)'),
        value: 'bytes',
      },
      {
        text: t('grafana-ui.utils.unit.decbytes', 'bytes(SI)'),
        value: 'decbytes',
      },
      {
        text: t('grafana-ui.utils.unit.bits', 'bits(IEC)'),
        value: 'bits',
      },
      {
        text: t('grafana-ui.utils.unit.decbits', 'bits(SI)'),
        value: 'decbits',
      },
      {
        text: t('grafana-ui.utils.unit.kbytes', 'kibibytes'),
        value: 'kbytes',
      },
      {
        text: t('grafana-ui.utils.unit.deckbytes', 'kilobytes'),
        value: 'deckbytes',
      },
      {
        text: t('grafana-ui.utils.unit.mbytes', 'mebibytes'),
        value: 'mbytes',
      },
      {
        text: t('grafana-ui.utils.unit.decmbytes', 'megabytes'),
        value: 'decmbytes',
      },
      {
        text: t('grafana-ui.utils.unit.gbytes', 'gibibytes'),
        value: 'gbytes',
      },
      {
        text: t('grafana-ui.utils.unit.decgbytes', 'gigabytes'),
        value: 'decgbytes',
      },
      {
        text: t('grafana-ui.utils.unit.tbytes', 'tebibytes'),
        value: 'tbytes',
      },
      {
        text: t('grafana-ui.utils.unit.dectbytes', 'terabytes'),
        value: 'dectbytes',
      },
      {
        text: t('grafana-ui.utils.unit.pbytes', 'pebibytes'),
        value: 'pbytes',
      },
      {
        text: t('grafana-ui.utils.unit.decpbytes', 'petabytes'),
        value: 'decpbytes',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Data rate', 'Data rate'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.pps', 'packets/sec'),
        value: 'pps',
      },
      {
        text: t('grafana-ui.utils.unit.binBps', 'bytes/sec(IEC)'),
        value: 'binBps',
      },
      {
        text: t('grafana-ui.utils.unit.Bps', 'bytes/sec(SI)'),
        value: 'Bps',
      },
      {
        text: t('grafana-ui.utils.unit.binbps', 'bits/sec(IEC)'),
        value: 'binbps',
      },
      {
        text: t('grafana-ui.utils.unit.bps', 'bits/sec(SI)'),
        value: 'bps',
      },
      {
        text: t('grafana-ui.utils.unit.KiBs', 'kibibytes/sec'),
        value: 'KiBs',
      },
      {
        text: t('grafana-ui.utils.unit.Kibits', 'kibibits/sec'),
        value: 'Kibits',
      },
      {
        text: t('grafana-ui.utils.unit.KBs', 'kilobytes/sec'),
        value: 'KBs',
      },
      {
        text: t('grafana-ui.utils.unit.Kbits', 'kilobits/sec'),
        value: 'Kbits',
      },
      {
        text: t('grafana-ui.utils.unit.MiBs', 'mebibytes/sec'),
        value: 'MiBs',
      },
      {
        text: t('grafana-ui.utils.unit.Mibits', 'mebibits/sec'),
        value: 'Mibits',
      },
      {
        text: t('grafana-ui.utils.unit.MBs', 'megabytes/sec'),
        value: 'MBs',
      },
      {
        text: t('grafana-ui.utils.unit.Mbits', 'megabits/sec'),
        value: 'Mbits',
      },
      {
        text: t('grafana-ui.utils.unit.GiBs', 'gibibytes/sec'),
        value: 'GiBs',
      },
      {
        text: t('grafana-ui.utils.unit.Gibits', 'gibibits/sec'),
        value: 'Gibits',
      },
      {
        text: t('grafana-ui.utils.unit.GBs', 'gigabytes/sec'),
        value: 'GBs',
      },
      {
        text: t('grafana-ui.utils.unit.Gbits', 'gigabits/sec'),
        value: 'Gbits',
      },
      {
        text: t('grafana-ui.utils.unit.TiBs', 'tebibytes/sec'),
        value: 'TiBs',
      },
      {
        text: t('grafana-ui.utils.unit.Tibits', 'tebibits/sec'),
        value: 'Tibits',
      },
      {
        text: t('grafana-ui.utils.unit.TBs', 'terabytes/sec'),
        value: 'TBs',
      },
      {
        text: t('grafana-ui.utils.unit.Tbits', 'terabits/sec'),
        value: 'Tbits',
      },
      {
        text: t('grafana-ui.utils.unit.PiBs', 'pebibytes/sec'),
        value: 'PiBs',
      },
      {
        text: t('grafana-ui.utils.unit.Pibits', 'pebibits/sec'),
        value: 'Pibits',
      },
      {
        text: t('grafana-ui.utils.unit.PBs', 'petabytes/sec'),
        value: 'PBs',
      },
      {
        text: t('grafana-ui.utils.unit.Pbits', 'petabits/sec'),
        value: 'Pbits',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Date & time', 'Date & time'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.dateTimeAsIso', 'Datetime ISO'),
        value: 'dateTimeAsIso',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsIsoNoDateIfToday', 'Datetime ISO (No date if today)'),
        value: 'dateTimeAsIsoNoDateIfToday',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsUS', 'Datetime US'),
        value: 'dateTimeAsUS',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsUSNoDateIfToday', 'Datetime US (No date if today)'),
        value: 'dateTimeAsUSNoDateIfToday',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsLocal', 'Datetime local'),
        value: 'dateTimeAsLocal',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsLocalNoDateIfToday', 'Datetime local (No date if today)'),
        value: 'dateTimeAsLocalNoDateIfToday',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeAsSystem', 'Datetime default'),
        value: 'dateTimeAsSystem',
      },
      {
        text: t('grafana-ui.utils.unit.dateTimeFromNow', 'From Now'),
        value: 'dateTimeFromNow',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Energy', 'Energy'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.watt', 'Watt (W)'),
        value: 'watt',
      },
      {
        text: t('grafana-ui.utils.unit.kwatt', 'Kilowatt (kW)'),
        value: 'kwatt',
      },
      {
        text: t('grafana-ui.utils.unit.megwatt', 'Megawatt (MW)'),
        value: 'megwatt',
      },
      {
        text: t('grafana-ui.utils.unit.gwatt', 'Gigawatt (GW)'),
        value: 'gwatt',
      },
      {
        text: t('grafana-ui.utils.unit.mwatt', 'Milliwatt (mW)'),
        value: 'mwatt',
      },
      {
        text: t('grafana-ui.utils.unit.Wm2', 'Watt per square meter (W/m²)'),
        value: 'Wm2',
      },
      {
        text: t('grafana-ui.utils.unit.voltamp', 'Volt-Ampere (VA)'),
        value: 'voltamp',
      },
      {
        text: t('grafana-ui.utils.unit.kvoltamp', 'Kilovolt-Ampere (kVA)'),
        value: 'kvoltamp',
      },
      {
        text: t('grafana-ui.utils.unit.voltampreact', 'Volt-Ampere reactive (VAr)'),
        value: 'voltampreact',
      },
      {
        text: t('grafana-ui.utils.unit.kvoltampreact', 'Kilovolt-Ampere reactive (kVAr)'),
        value: 'kvoltampreact',
      },
      {
        text: t('grafana-ui.utils.unit.watth', 'Watt-hour (Wh)'),
        value: 'watth',
      },
      {
        text: t('grafana-ui.utils.unit.watthperkg', 'Watt-hour per Kilogram (Wh/kg)'),
        value: 'watthperkg',
      },
      {
        text: t('grafana-ui.utils.unit.kwatth', 'Kilowatt-hour (kWh)'),
        value: 'kwatth',
      },
      {
        text: t('grafana-ui.utils.unit.kwattm', 'Kilowatt-min (kWm)'),
        value: 'kwattm',
      },
      {
        text: t('grafana-ui.utils.unit.amph', 'Ampere-hour (Ah)'),
        value: 'amph',
      },
      {
        text: t('grafana-ui.utils.unit.kamph', 'Kiloampere-hour (kAh)'),
        value: 'kamph',
      },
      {
        text: t('grafana-ui.utils.unit.mamph', 'Milliampere-hour (mAh)'),
        value: 'mamph',
      },
      {
        text: t('grafana-ui.utils.unit.joule', 'Joule (J)'),
        value: 'joule',
      },
      {
        text: t('grafana-ui.utils.unit.ev', 'Electron volt (eV)'),
        value: 'ev',
      },
      {
        text: t('grafana-ui.utils.unit.amp', 'Ampere (A)'),
        value: 'amp',
      },
      {
        text: t('grafana-ui.utils.unit.kamp', 'Kiloampere (kA)'),
        value: 'kamp',
      },
      {
        text: t('grafana-ui.utils.unit.mamp', 'Milliampere (mA)'),
        value: 'mamp',
      },
      {
        text: t('grafana-ui.utils.unit.volt', 'Volt (V)'),
        value: 'volt',
      },
      {
        text: t('grafana-ui.utils.unit.kvolt', 'Kilovolt (kV)'),
        value: 'kvolt',
      },
      {
        text: t('grafana-ui.utils.unit.mvolt', 'Millivolt (mV)'),
        value: 'mvolt',
      },
      {
        text: t('grafana-ui.utils.unit.dBm', 'Decibel-milliwatt (dBm)'),
        value: 'dBm',
      },
      {
        text: t('grafana-ui.utils.unit.ohm', 'Ohm (Ω)'),
        value: 'ohm',
      },
      {
        text: t('grafana-ui.utils.unit.kohm', 'Kiloohm (kΩ)'),
        value: 'kohm',
      },
      {
        text: t('grafana-ui.utils.unit.Mohm', 'Megaohm (MΩ)'),
        value: 'Mohm',
      },
      {
        text: t('grafana-ui.utils.unit.farad', 'Farad (F)'),
        value: 'farad',
      },
      {
        text: t('grafana-ui.utils.unit.µfarad', 'Microfarad (µF)'),
        value: 'µfarad',
      },
      {
        text: t('grafana-ui.utils.unit.nfarad', 'Nanofarad (nF)'),
        value: 'nfarad',
      },
      {
        text: t('grafana-ui.utils.unit.pfarad', 'Picofarad (pF)'),
        value: 'pfarad',
      },
      {
        text: t('grafana-ui.utils.unit.ffarad', 'Femtofarad (fF)'),
        value: 'ffarad',
      },
      {
        text: t('grafana-ui.utils.unit.henry', 'Henry (H)'),
        value: 'henry',
      },
      {
        text: t('grafana-ui.utils.unit.mhenry', 'Millihenry (mH)'),
        value: 'mhenry',
      },
      {
        text: t('grafana-ui.utils.unit.µhenry', 'Microhenry (µH)'),
        value: 'µhenry',
      },
      {
        text: t('grafana-ui.utils.unit.lumens', 'Lumens (Lm)'),
        value: 'lumens',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Flow', 'Flow'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.flowgpm', 'Gallons/min (gpm)'),
        value: 'flowgpm',
      },
      {
        text: t('grafana-ui.utils.unit.flowcms', 'Cubic meters/sec (cms)'),
        value: 'flowcms',
      },
      {
        text: t('grafana-ui.utils.unit.flowcfs', 'Cubic feet/sec (cfs)'),
        value: 'flowcfs',
      },
      {
        text: t('grafana-ui.utils.unit.flowcfm', 'Cubic feet/min (cfm)'),
        value: 'flowcfm',
      },
      {
        text: t('grafana-ui.utils.unit.litreh', 'Litre/hour'),
        value: 'litreh',
      },
      {
        text: t('grafana-ui.utils.unit.flowlpm', 'Litre/min (L/min)'),
        value: 'flowlpm',
      },
      {
        text: t('grafana-ui.utils.unit.flowmlpm', 'milliLitre/min (mL/min)'),
        value: 'flowmlpm',
      },
      {
        text: t('grafana-ui.utils.unit.lux', 'Lux (lx)'),
        value: 'lux',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Force', 'Force'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.forceNm', 'Newton-meters (Nm)'),
        value: 'forceNm',
      },
      {
        text: t('grafana-ui.utils.unit.forcekNm', 'Kilonewton-meters (kNm)'),
        value: 'forcekNm',
      },
      {
        text: t('grafana-ui.utils.unit.forceN', 'Newtons (N)'),
        value: 'forceN',
      },
      {
        text: t('grafana-ui.utils.unit.forcekN', 'Kilonewtons (kN)'),
        value: 'forcekN',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Hash rate', 'Hash rate'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.Hs', 'hashes/sec'),
        value: 'Hs',
      },
      {
        text: t('grafana-ui.utils.unit.KHs', 'kilohashes/sec'),
        value: 'KHs',
      },
      {
        text: t('grafana-ui.utils.unit.MHs', 'megahashes/sec'),
        value: 'MHs',
      },
      {
        text: t('grafana-ui.utils.unit.GHs', 'gigahashes/sec'),
        value: 'GHs',
      },
      {
        text: t('grafana-ui.utils.unit.THs', 'terahashes/sec'),
        value: 'THs',
      },
      {
        text: t('grafana-ui.utils.unit.PHs', 'petahashes/sec'),
        value: 'PHs',
      },
      {
        text: t('grafana-ui.utils.unit.EHs', 'exahashes/sec'),
        value: 'EHs',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Mass', 'Mass'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.massmg', 'milligram (mg)'),
        value: 'massmg',
      },
      {
        text: t('grafana-ui.utils.unit.massg', 'gram (g)'),
        value: 'massg',
      },
      {
        text: t('grafana-ui.utils.unit.masslb', 'pound (lb)'),
        value: 'masslb',
      },
      {
        text: t('grafana-ui.utils.unit.masskg', 'kilogram (kg)'),
        value: 'masskg',
      },
      {
        text: t('grafana-ui.utils.unit.masst', 'metric ton (t)'),
        value: 'masst',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Length', 'Length'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.lengthmm', 'millimeter (mm)'),
        value: 'lengthmm',
      },
      {
        text: t('grafana-ui.utils.unit.lengthin', 'inch (in)'),
        value: 'lengthin',
      },
      {
        text: t('grafana-ui.utils.unit.lengthft', 'feet (ft)'),
        value: 'lengthft',
      },
      {
        text: t('grafana-ui.utils.unit.lengthm', 'meter (m)'),
        value: 'lengthm',
      },
      {
        text: t('grafana-ui.utils.unit.lengthkm', 'kilometer (km)'),
        value: 'lengthkm',
      },
      {
        text: t('grafana-ui.utils.unit.lengthmi', 'mile (mi)'),
        value: 'lengthmi',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Pressure', 'Pressure'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.pressurembar', 'Millibars'),
        value: 'pressurembar',
      },
      {
        text: t('grafana-ui.utils.unit.pressurebar', 'Bars'),
        value: 'pressurebar',
      },
      {
        text: t('grafana-ui.utils.unit.pressurekbar', 'Kilobars'),
        value: 'pressurekbar',
      },
      {
        text: t('grafana-ui.utils.unit.pressurepa', 'Pascals'),
        value: 'pressurepa',
      },
      {
        text: t('grafana-ui.utils.unit.pressurehpa', 'Hectopascals'),
        value: 'pressurehpa',
      },
      {
        text: t('grafana-ui.utils.unit.pressurekpa', 'Kilopascals'),
        value: 'pressurekpa',
      },
      {
        text: t('grafana-ui.utils.unit.pressurehg', 'Inches of mercury'),
        value: 'pressurehg',
      },
      {
        text: t('grafana-ui.utils.unit.pressurepsi', 'PSI'),
        value: 'pressurepsi',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Radiation', 'Radiation'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.radbq', 'Becquerel (Bq)'),
        value: 'radbq',
      },
      {
        text: t('grafana-ui.utils.unit.radci', 'curie (Ci)'),
        value: 'radci',
      },
      {
        text: t('grafana-ui.utils.unit.radgy', 'Gray (Gy)'),
        value: 'radgy',
      },
      {
        text: t('grafana-ui.utils.unit.radrad', 'rad'),
        value: 'radrad',
      },
      {
        text: t('grafana-ui.utils.unit.radsv', 'Sievert (Sv)'),
        value: 'radsv',
      },
      {
        text: t('grafana-ui.utils.unit.radmsv', 'milliSievert (mSv)'),
        value: 'radmsv',
      },
      {
        text: t('grafana-ui.utils.unit.radusv', 'microSievert (µSv)'),
        value: 'radusv',
      },
      {
        text: t('grafana-ui.utils.unit.radrem', 'rem'),
        value: 'radrem',
      },
      {
        text: t('grafana-ui.utils.unit.radexpckg', 'Exposure (C/kg)'),
        value: 'radexpckg',
      },
      {
        text: t('grafana-ui.utils.unit.radr', 'roentgen (R)'),
        value: 'radr',
      },
      {
        text: t('grafana-ui.utils.unit.radsvh', 'Sievert/hour (Sv/h)'),
        value: 'radsvh',
      },
      {
        text: t('grafana-ui.utils.unit.radmsvh', 'milliSievert/hour (mSv/h)'),
        value: 'radmsvh',
      },
      {
        text: t('grafana-ui.utils.unit.radusvh', 'microSievert/hour (µSv/h)'),
        value: 'radusvh',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Rotational Speed', 'Rotational Speed'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.rotrpm', 'Revolutions per minute (rpm)'),
        value: 'rotrpm',
      },
      {
        text: t('grafana-ui.utils.unit.rothz', 'Hertz (Hz)'),
        value: 'rothz',
      },
      {
        text: t('grafana-ui.utils.unit.rotrads', 'Radians per second (rad/s)'),
        value: 'rotrads',
      },
      {
        text: t('grafana-ui.utils.unit.rotdegs', 'Degrees per second (°/s)'),
        value: 'rotdegs',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Temperature', 'Temperature'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.celsius', 'Celsius (°C)'),
        value: 'celsius',
      },
      {
        text: t('grafana-ui.utils.unit.fahrenheit', 'Fahrenheit (°F)'),
        value: 'fahrenheit',
      },
      {
        text: t('grafana-ui.utils.unit.kelvin', 'Kelvin (K)'),
        value: 'kelvin',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Time', 'Time'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.hertz', 'Hertz (1/s)'),
        value: 'hertz',
      },
      {
        text: t('grafana-ui.utils.unit.ns', 'nanoseconds (ns)'),
        value: 'ns',
      },
      {
        text: t('grafana-ui.utils.unit.µs', 'microseconds (µs)'),
        value: 'µs',
      },
      {
        text: t('grafana-ui.utils.unit.ms', 'milliseconds (ms)'),
        value: 'ms',
      },
      {
        text: t('grafana-ui.utils.unit.s', 'seconds (s)'),
        value: 's',
      },
      {
        text: t('grafana-ui.utils.unit.m', 'minutes (m)'),
        value: 'm',
      },
      {
        text: t('grafana-ui.utils.unit.h', 'hours (h)'),
        value: 'h',
      },
      {
        text: t('grafana-ui.utils.unit.d', 'days (d)'),
        value: 'd',
      },
      {
        text: t('grafana-ui.utils.unit.dtdurationms', 'duration (ms)'),
        value: 'dtdurationms',
      },
      {
        text: t('grafana-ui.utils.unit.dtdurations', 'duration (s)'),
        value: 'dtdurations',
      },
      {
        text: t('grafana-ui.utils.unit.dthms', 'duration (hh:mm:ss)'),
        value: 'dthms',
      },
      {
        text: t('grafana-ui.utils.unit.dtdhms', 'duration (d hh:mm:ss)'),
        value: 'dtdhms',
      },
      {
        text: t('grafana-ui.utils.unit.timeticks', 'Timeticks (s/100)'),
        value: 'timeticks',
      },
      {
        text: t('grafana-ui.utils.unit.clockms', 'clock (ms)'),
        value: 'clockms',
      },
      {
        text: t('grafana-ui.utils.unit.clocks', 'clock (s)'),
        value: 'clocks',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Throughput', 'Throughput'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.cps', 'counts/sec (cps)'),
        value: 'cps',
      },
      {
        text: t('grafana-ui.utils.unit.ops', 'ops/sec (ops)'),
        value: 'ops',
      },
      {
        text: t('grafana-ui.utils.unit.reqps', 'requests/sec (rps)'),
        value: 'reqps',
      },
      {
        text: t('grafana-ui.utils.unit.rps', 'reads/sec (rps)'),
        value: 'rps',
      },
      {
        text: t('grafana-ui.utils.unit.wps', 'writes/sec (wps)'),
        value: 'wps',
      },
      {
        text: t('grafana-ui.utils.unit.iops', 'I/O ops/sec (iops)'),
        value: 'iops',
      },
      {
        text: t('grafana-ui.utils.unit.cpm', 'counts/min (cpm)'),
        value: 'cpm',
      },
      {
        text: t('grafana-ui.utils.unit.opm', 'ops/min (opm)'),
        value: 'opm',
      },
      {
        text: t('grafana-ui.utils.unit.rpm', 'reads/min (rpm)'),
        value: 'rpm',
      },
      {
        text: t('grafana-ui.utils.unit.wpm', 'writes/min (wpm)'),
        value: 'wpm',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Velocity', 'Velocity'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.velocityms', 'meters/second (m/s)'),
        value: 'velocityms',
      },
      {
        text: t('grafana-ui.utils.unit.velocitykmh', 'kilometers/hour (km/h)'),
        value: 'velocitykmh',
      },
      {
        text: t('grafana-ui.utils.unit.velocitymph', 'miles/hour (mph)'),
        value: 'velocitymph',
      },
      {
        text: t('grafana-ui.utils.unit.velocityknot', 'knot (kn)'),
        value: 'velocityknot',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Volume', 'Volume'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.mlitre', 'millilitre (mL)'),
        value: 'mlitre',
      },
      {
        text: t('grafana-ui.utils.unit.litre', 'litre (L)'),
        value: 'litre',
      },
      {
        text: t('grafana-ui.utils.unit.m3', 'cubic meter'),
        value: 'm3',
      },
      {
        text: t('grafana-ui.utils.unit.Nm3', 'Normal cubic meter'),
        value: 'Nm3',
      },
      {
        text: t('grafana-ui.utils.unit.dm3', 'cubic decimeter'),
        value: 'dm3',
      },
      {
        text: t('grafana-ui.utils.unit.gallons', 'gallons'),
        value: 'gallons',
      },
    ],
  },
  {
    text: t('grafana-ui.utils.unit.Boolean', 'Boolean'),
    submenu: [
      {
        text: t('grafana-ui.utils.unit.bool', 'True/False'),
        value: 'bool',
      },
      {
        text: t('grafana-ui.utils.unit.bool_yes_no', 'Yes/No'),
        value: 'bool_yes_no',
      },
      {
        text: t('grafana-ui.utils.unit.bool_on_off', 'On/Off'),
        value: 'bool_on_off',
      },
    ],
  },
];
