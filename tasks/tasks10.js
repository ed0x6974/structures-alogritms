/*
    Grapheme Cluster Iterator
    Implement an iterator that breaks a string into individual graphemes (user-perceived characters).
    Requirement: The iterator must account for diacritical marks (accents), country flags (regional indicator symbols), and complex emoji modifiers (skin tones, gender modifiers, and Zero Width Joiners).

    Example: [...iter('1😃à🇵🇱👩🏽‍❤️‍💋‍👨')] should return ['1', '😃', 'à', '🇵🇱', '👩🏽‍❤️‍💋‍👨'].
*/

function iter(str) {
    const buffer = new ArrayBuffer(str.length * 2);
    const buf16 = new Uint16Array(buffer);

    for (let i = 0; i < str.length; i++) {
        buf16[i] = str.charCodeAt(i);
    }   

    return {
        [Symbol.iterator]() {
            console.log(buf16);
            return {
                current: 0,
                last: buf16.length,

                isHighSurrogate(codeUnit) {
                    return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
                },

                isCombining(codeUnit) {
                    return (codeUnit >= 0x0300 && codeUnit <= 0x036F) || 
                        (codeUnit >= 0x0483 && codeUnit <= 0x0489) ||
                        (codeUnit >= 0x1DC0 && codeUnit <= 0x1DFF) ||
                        (codeUnit >= 0x20D0 && codeUnit <= 0x20FF) ||
                        (codeUnit >= 0xFE20 && codeUnit <= 0xFE2F);
                },

                isRegionalIndicator(codePoint) {
                    return codePoint >= 0x1F1E6 && codePoint <= 0x1F1FF;
                },

                isGlue(codeUnit) {
                    return codeUnit === 0x200D;
                },

                isPaintableBMPEmoji(codeUnit) {
                    return (
                        codeUnit === 0x261D || // ☝
                        codeUnit === 0x26F7 || // ⛷
                        codeUnit === 0x26F9 || // ⛹
                        (codeUnit >= 0x270A && codeUnit <= 0x270D) // ✊, ✋, ✌, ✍
                    );
                },

                isPaintableSurrogate(codePoint) {
                    return (
                        (codePoint >= 0x1F3C2 && codePoint <= 0x1F3C4) ||
                        codePoint === 0x1F3C7 ||                         
                        codePoint === 0x1F3CA ||                       
                        (codePoint >= 0x1F442 && codePoint <= 0x1F443) ||
                        (codePoint >= 0x1F446 && codePoint <= 0x1F450) ||
                        (codePoint >= 0x1F466 && codePoint <= 0x1F478) || 
                        codePoint === 0x1F47C ||                          
                        (codePoint >= 0x1F481 && codePoint <= 0x1F487) ||
                        codePoint === 0x1F4AA ||                         
                        (codePoint >= 0x1F590 && codePoint <= 0x1F596) ||
                        (codePoint >= 0x1F645 && codePoint <= 0x1F64F) ||
                        codePoint === 0x1F6A3 ||                          
                        (codePoint >= 0x1F6B4 && codePoint <= 0x1F6B6) ||
                        codePoint === 0x1F6C0 ||                          
                        (codePoint >= 0x1F918 && codePoint <= 0x1F91F) ||
                        codePoint === 0x1F926 ||                          
                        (codePoint >= 0x1F930 && codePoint <= 0x1F93E) ||
                        (codePoint >= 0x1F9D1 && codePoint <= 0x1F9DD)
                    );
                },

                isSkinToneModifier(codePoint) {
                    return codePoint >= 0x1F3FB && codePoint <= 0x1F3FF;
                },

                canHaveEmojiVariation(codeUnit) {
                    return (
                        (codeUnit >= 0x2600 && codeUnit <= 0x26FF) ||
                        (codeUnit >= 0x2700 && codeUnit <= 0x27BF) ||
                        (codeUnit >= 0x2300 && codeUnit <= 0x23FF)
                    );
                },

                isEmojiVariationUnit(codeUnit) {
                    return codeUnit === 0xFE0F;
                },

                getNextEmojiVariationUnit(index) {
                    if (index >= buf16.length) {
                        return;
                    }

                    const codeUnit = buf16[index];
                    
                    if (this.isEmojiVariationUnit(codeUnit)) {
                        return codeUnit;
                    }
                },

                getNextCombiners(index) {
                    if (index >= buf16.length) {
                        return;
                    }
                    
                    const combiners = [];
                    let i = index;

                    while (this.isCombining(buf16[i]) && i < this.last) {
                        combiners.push(buf16[i]);
                        i++;
                    }

                    if (combiners.length > 0) {
                        return combiners
                    }
                },

                getNextSurrogate(index) {
                    if (index >= buf16.length) {
                        return;
                    }

                    const codeUnit = buf16[index];

                    if (this.isHighSurrogate(codeUnit) && index+1 <= this.last) {
                        const high = codeUnit;
                        const low = buf16[index+1];

                        const codePoint = (high - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;

                        return codePoint;
                    }
                },

                getNextGlue(index) {
                    if (index >= buf16.length) {
                        return;
                    }

                    const codeUnit = buf16[index];

                    if (this.isGlue(codeUnit)) {
                        return codeUnit;
                    }
                },

                getNextSkinColor(index) {
                    if (index >= buf16.length) {
                        return;
                    }

                    const surrogate = this.getNextSurrogate(index);

                    if (surrogate) {
                        if (this.isSkinToneModifier(surrogate)) {
                            return surrogate;
                        }
                    }
                },

                moveCursor(n) {
                    this.current = this.current + n;
                },

                next() {
                    if (this.current < this.last) {
                        const graphemePoints = [];

                        while (true) {
                            const surrogate = this.getNextSurrogate(this.current);
                            if (surrogate) {
                                graphemePoints.push(surrogate);
                                this.moveCursor(2);

                                if (this.isRegionalIndicator(surrogate)) {
                                    const nextSurrogate = this.getNextSurrogate(this.current);
                                    if (nextSurrogate && this.isRegionalIndicator(nextSurrogate)) {
                                        graphemePoints.push(nextSurrogate);
                                        this.moveCursor(2);
                                    }
                                }

                                if (this.isPaintableSurrogate(surrogate)) {
                                    const skin = this.getNextSkinColor(this.current);

                                    if (skin) {
                                        graphemePoints.push(skin);
                                        this.moveCursor(2);
                                    }
                                }
                            } else {
                                const prevCursor = this.current;
                                graphemePoints.push(buf16[this.current]);
                                this.moveCursor(1);

                                if (this.isPaintableBMPEmoji(buf16[prevCursor])) {
                                    const skin = this.getNextSkinColor(this.current);

                                    if (skin) {
                                        graphemePoints.push(skin);
                                        this.moveCursor(2);
                                    }
                                }

                                if (this.canHaveEmojiVariation(buf16[prevCursor])) {
                                    const modificator = this.getNextEmojiVariationUnit(this.current);

                                    if (modificator) {
                                        graphemePoints.push(modificator);
                                        this.moveCursor(1);
                                    }
                                } 
                            }

                            const combiners = this.getNextCombiners(this.current);
                            if (combiners) {
                                graphemePoints.push(...combiners);
                                this.moveCursor(combiners.length);
                            }

                            const glue = this.getNextGlue(this.current);
                            if (glue) {
                                graphemePoints.push(glue);
                                this.moveCursor(1);
                                continue;
                            } else {
                                break;
                            }
                        }

                        return { done: false, value: String.fromCodePoint(...graphemePoints)};
                    } else {
                        return { done: true };
                    }
                }
            };
        }
    }
}