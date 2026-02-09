/*
    Implement a function that determines whether a given string is a number or not. It must support not only Arabic numerals but also other numeric systems. The use of Regular Expressions (Regex) is forbidden.
    
    isDigit('123') // true
    isDigit('Ⅻ')  // true
*/


var notations = [
    {
        name: "basicLatin",
        from: '\u0030'.codePointAt(0),
        to: '\u0039'.codePointAt(0),
        additionalCodes: null,
    },
    {
        name: "arabicIndic",
        from: '\u0660'.codePointAt(0),
        to: '\u0669'.codePointAt(0),
        additionalCodes: null,
    },
    {
        name: "devanagari",
        from: '\u0966'.codePointAt(0),
        to: '\u096F'.codePointAt(0),
        additionalCodes: null,
    },
    {
        name: "thai",
        from: '\u0E50'.codePointAt(0),
        to: '\u0E59'.codePointAt(0),
        additionalCodes: null,
    },
    {
        name: "fullwidth",
        from: '\uFF10'.codePointAt(0),
        to: '\uFF19'.codePointAt(0),
        additionalCodes: null,
    },
    {
        name: "roman",
        from: '\u2160'.codePointAt(0),
        to: '\u2188'.codePointAt(0),
        additionalCodes: new Set([
            'I','V','X','L','C','D','M',
            'i','v','x','l','c','d','m'
        ].map(c => c.codePointAt(0))),
    },
];

/*
    isDigit is better in current conditions
*/

function isDigit(str) {
    let currentNotationIndex = -1;

    const belongsToNotation = (notation, unicode) => {
        if (unicode >= notation.from && unicode <= notation.to) {
            return true;
        }
                        
        if (notation.additionalCodes && notation.additionalCodes.has(unicode)) {
            return true;
        }

        return false;
    }

    for (let char of str) {
        const unicode = char.codePointAt(0);

        if (currentNotationIndex === -1) {
            const matchedNotationIndex = notations.findIndex((notation) => belongsToNotation(notation, unicode));

            if (matchedNotationIndex >= 0) {
                currentNotationIndex = matchedNotationIndex;
            } else {
                return false;
            }
        } else {
            if (!belongsToNotation(notations[currentNotationIndex], unicode)) {
                return false;
            }
        }
    }

    return currentNotationIndex >= 0 ? true : false;
}

var digitLookupHashMap = new Map([
    [0x30, "basicLatin"], [0x31, "basicLatin"], [0x32, "basicLatin"], [0x33, "basicLatin"], [0x34, "basicLatin"], [0x35, "basicLatin"], [0x36, "basicLatin"], [0x37, "basicLatin"], [0x38, "basicLatin"], [0x39, "basicLatin"],
    [0x660, "arabicIndic"], [0x661, "arabicIndic"], [0x662, "arabicIndic"], [0x663, "arabicIndic"], [0x664, "arabicIndic"], [0x665, "arabicIndic"], [0x666, "arabicIndic"], [0x667, "arabicIndic"], [0x668, "arabicIndic"], [0x669, "arabicIndic"],
    [0x966, "devanagari"], [0x967, "devanagari"], [0x968, "devanagari"], [0x969, "devanagari"], [0x96A, "devanagari"], [0x96B, "devanagari"], [0x96C, "devanagari"], [0x96D, "devanagari"], [0x96E, "devanagari"], [0x96F, "devanagari"],
    [0xE50, "thai"], [0xE51, "thai"], [0xE52, "thai"], [0xE53, "thai"], [0xE54, "thai"], [0xE55, "thai"], [0xE56, "thai"], [0xE57, "thai"], [0xE58, "thai"], [0xE59, "thai"],
    [0xFF10, "fullwidth"], [0xFF11, "fullwidth"], [0xFF12, "fullwidth"], [0xFF13, "fullwidth"], [0xFF14, "fullwidth"], [0xFF15, "fullwidth"], [0xFF16, "fullwidth"], [0xFF17, "fullwidth"], [0xFF18, "fullwidth"], [0xFF19, "fullwidth"],
    [0x2160, "roman"], [0x2161, "roman"], [0x2162, "roman"], [0x2163, "roman"], [0x2164, "roman"], [0x2165, "roman"], [0x2166, "roman"], [0x2167, "roman"], [0x2168, "roman"], [0x2169, "roman"], [0x216A, "roman"], [0x216B, "roman"], [0x216C, "roman"], [0x216D, "roman"], [0x216E, "roman"], [0x216F, "roman"], [0x2170, "roman"], [0x2171, "roman"], [0x2172, "roman"], [0x2173, "roman"], [0x2174, "roman"], [0x2175, "roman"], [0x2176, "roman"], [0x2177, "roman"], [0x2178, "roman"], [0x2179, "roman"], [0x217A, "roman"], [0x217B, "roman"], [0x217C, "roman"], [0x217D, "roman"], [0x217E, "roman"], [0x217F, "roman"], [0x2180, "roman"], [0x2181, "roman"], [0x2182, "roman"], [0x2183, "roman"], [0x2184, "roman"], [0x2185, "roman"], [0x2186, "roman"], [0x2187, "roman"], [0x2188, "roman"],
    [0x49, "roman"], [0x56, "roman"], [0x58, "roman"], [0x4C, "roman"], [0x43, "roman"], [0x44, "roman"], [0x4D, "roman"],
    [0x69, "roman"], [0x76, "roman"], [0x78, "roman"], [0x6C, "roman"], [0x63, "roman"], [0x64, "roman"], [0x6D, "roman"]
]);

/*
    isDigitHashMap can be better if we will have a lot of notations
*/

function isDigitHashMap(str) {
    let currentNotation = null;

    const belongsToNotation = (notation, unicode) => {
        if (!notation) return false;

        const codeNotation = digitLookupHashMap.get(unicode);

        return codeNotation === notation;
    }

    for (let char of str) {
        const unicode = char.codePointAt(0);

        if (!currentNotation) {
            const notation = digitLookupHashMap.get(unicode);

            if (notation) {
                currentNotation = notation;
            } else {
                return false;
            }
        } else {
            if (!belongsToNotation(currentNotation, unicode)) {
                return false;
            }
        }
    }

    return currentNotation ? true : false;
}