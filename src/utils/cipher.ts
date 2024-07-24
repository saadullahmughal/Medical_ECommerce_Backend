/**
 * Encodes the plaintext using shift 3 forward applying on both alphabets and digits but on both separately
 * @param {String} plainText
 * @returns {String} cipherText
 */
const encodeCaesar = (plainText: string): string => {
    let cipherText = ""
    for (const oldChar of plainText) {
        let char = oldChar
        if (char >= "A" && char <= "Z") {
            char = String.fromCharCode(char.charCodeAt(0) + 3)
            if (char > "Z") {
                let diff = char.charCodeAt(0) - "Z".charCodeAt(0) - 1
                char = String.fromCharCode("A".charCodeAt(0) + diff)
            }
        }
        if (char >= "a" && char <= "z") {
            char = String.fromCharCode(char.charCodeAt(0) + 3)
            if (char > "z") {
                let diff = char.charCodeAt(0) - "z".charCodeAt(0) - 1
                char = String.fromCharCode("a".charCodeAt(0) + diff)
            }
        }
        if (char >= "0" && char <= "9") {
            char = String.fromCharCode(char.charCodeAt(0) + 3)
            if (char > "9") {
                let diff = char.charCodeAt(0) - "9".charCodeAt(0) - 1
                char = String.fromCharCode("0".charCodeAt(0) + diff)
            }
        }
        cipherText += char
    }
    return cipherText
}

/**
 * Decodes the ciphertext using shift 3 backward applying on both alphabets and digits but on both separately
 * @param {String} cipherText
 * @returns {String} plainText
 */
const decodeCaesar = (cipherText: string): string => {
    let plainText = ""
    for (const oldChar of cipherText) {
        let char = oldChar
        if (char >= "A" && char <= "Z") {
            char = String.fromCharCode(char.charCodeAt(0) - 3)
            if (char < "A") {
                let diff = "A".charCodeAt(0) - char.charCodeAt(0) - 1
                char = String.fromCharCode("Z".charCodeAt(0) - diff)
            }
        }
        if (char >= "a" && char <= "z") {
            char = String.fromCharCode(char.charCodeAt(0) - 3)
            if (char < "a") {
                let diff = "a".charCodeAt(0) - char.charCodeAt(0) - 1
                char = String.fromCharCode("z".charCodeAt(0) - diff)
            }
        }
        if (char >= "0" && char <= "9") {
            char = String.fromCharCode(char.charCodeAt(0) - 3)
            if (char < "0") {
                let diff = "0".charCodeAt(0) - char.charCodeAt(0) - 1
                char = String.fromCharCode("9".charCodeAt(0) - diff)
            }
        }
        plainText += char
    }
    return plainText
}

module.exports = { encodeCaesar, decodeCaesar }

console.log(encodeCaesar("Saad"))
