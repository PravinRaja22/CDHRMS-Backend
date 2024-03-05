export function convertCurrencyToWords(amount) {
    const wordsUnder20 = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const wordsTensMultiples = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const wordsThousands = ["", "Thousand", "Million", "Billion", "Trillion"];
    function convertLessThanThousand(number) {
        if (number === 0) {
            return "";
        }
        else if (number < 20) {
            return wordsUnder20[number] + " ";
        }
        else if (number < 100) {
            return (wordsTensMultiples[Math.floor(number / 10)] +
                " " +
                convertLessThanThousand(number % 10));
        }
        else {
            return (wordsUnder20[Math.floor(number / 100)] +
                " Hundred " +
                convertLessThanThousand(number % 100));
        }
    }
    function convert(number) {
        if (number === 0) {
            return "Zero";
        }
        let result = "";
        let chunkIndex = 0;
        do {
            const chunk = number % 1000;
            if (chunk !== 0) {
                result =
                    convertLessThanThousand(chunk) +
                        wordsThousands[chunkIndex] +
                        " " +
                        result;
            }
            number = Math.floor(number / 1000);
            chunkIndex++;
        } while (number > 0);
        return result.trim();
    }
    // Check if the input is a valid number
    if (isNaN(amount) || !isFinite(amount)) {
        return "Invalid input";
    }
    // Convert the amount to words
    const wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - wholePart) * 100);
    const wordsWholePart = convert(wholePart);
    const wordsDecimalPart = convertLessThanThousand(decimalPart);
    let result = wordsWholePart;
    if (decimalPart !== 0) {
        result += " and Cents " + wordsDecimalPart;
    }
    return `${result} Only`;
}
//# sourceMappingURL=CurrencyToWords.js.map