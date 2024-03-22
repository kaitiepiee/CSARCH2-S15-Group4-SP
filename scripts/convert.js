$(document).ready(function() {
    
    $(".convert-button").click(function() {
        convert();
    });

    function convert() {
        
        // Get Input
        let decimalInput = parseFloat(document.getElementById("decimalInput").value);
        let exponentInput = parseInt(document.getElementById("exponentInput").value);
        
        // NORMALIZE
        while (!Number.isInteger(decimalInput)) {
            decimalInput *= 10;
            exponentInput -= 1;
        }
        
        decimalInput = Math.round(decimalInput);

        // Initialization
        var normalizedInput = decimalInput.toFixed(34);
        // CHANGE THIS LATER
        var e_prime = exponentInput + 101;

        // Start of Conversion
        var output = [128];
        
        // OUTPUT
        document.getElementById("binaryOutput").textContent = "place the binary output here";
        document.getElementById("hexOutput").textContent = "place the hex output here";

        document.getElementById("decimalDisplay").textContent = "Decimal Input: " + decimalInput;
        document.getElementById("exponentDisplay").textContent = "Exponent Input: " + exponentInput;

        // MSB CHECK
        if (decimalInput < 0) {
            output[0] = 1;
        } else {
            output[0] = 0;
        }
        document.getElementById("outputDisplay").textContent = "MSB: " + output.join("");


        // MSD (Leftmost) CHECK
        var decimalInputString = Math.abs(decimalInput).toString();
        if (decimalInputString[0] === '0') {
            var leftmostDigit = '0';
        } else {
            var leftmostDigit = decimalInputString[0];
        }
        var binaryLeftmostDigit = parseInt(leftmostDigit).toString(2).padStart(4, '0');
        document.getElementById("binaryOutputDisplay").textContent = "Binary MSD Output: " + leftmostDigit + "=" + binaryLeftmostDigit;


        // E' to BINARY
        var binaryEPrime = e_prime.toString(2);
        var padSize = 4 - (binaryEPrime.length % 4);
        if (padSize === 4) padSize = 0; // If the length is already a multiple of 4, don't add any padding
        var paddedBinaryEPrime = binaryEPrime.padStart(binaryEPrime.length + padSize, '0');
        document.getElementById("EPrimeOutputDisplay").textContent = "Binary E Prime Output: " + e_prime + " = " + paddedBinaryEPrime;

        // COMBINATION BIT
        if (leftmostDigit >= 1 && leftmostDigit <= 7) {
            var expMSB = paddedBinaryEPrime.slice(0, 2);
            var coefMSD = binaryLeftmostDigit.slice(-3);
            var combinationBit = expMSB + coefMSD;
        }

        else if (leftmostDigit >= 8 && leftmostDigit <= 9) {
            var expMSB = paddedBinaryEPrime.slice(0, 2);
            var coefMSD = binaryLeftmostDigit.slice(-1);
            var combinationBit = '11' + expMSB + coefMSD;
        }

        document.getElementById("combinationOutputDisplay").textContent += "\nCombination Bit: " + combinationBit;

    }

// Decimal-128 Floating Point Converter
// 128-bit: MSb for sign, next 5 for continuation bit, next 12 for exponent continuation bit, and 110 for mantissa combination bit

// Rules:
// 1. Decimal
// 2. Base 10
// 3. Normalize to 34 whole digits
// 4. E' = E + 6176

// Steps outline:
// 1. MSB (Sign): 0 if +, 1 if -
// O, XXXXX, XXXXXXXXXXXX, X...X

// 2. MSD (Leftmost digit):
// -Convert to binary (Modulo until 1)
// Y Y Y Y
// _ C D E

// 3. E' = exponent + 6176:
// -6176 - exponent = E'
// -Convert E' to binary (Modulo until 1)
// ZZ ZZZZ ZZZZ ZZZZ
// AB exponent

// -If else MSD >= 1 && <= 7
// a b c d e	WHERE Exp (a b) |	Coefficient MSD (0 c d e)
// -If else MSD >= 8 && <= 9
// 1 1 c d e	WHERE Exp (c d) |	Coefficient MSD (1 0 0 e)
// -If else Infinity
// 1 1 1 1 0
// -Else (Nan)
// 1 1 1 1 0

// O, OOOOO, XXXXXXXXXXXX, X...X

// 4. Append the rest of exponent
// O, OOOOO, OOOOOOOOOOOO, X...X

// 5. BCD FOR THE REST
// Get most significant 3 digits (nt including msd)

// 6. Convert to hex
// Get least significant 4 digits, get hex equivalent

// truncate function
// round down function
// round up function
// round to nearest [ties-to-even] function
    function downloadOutput() {
        const binaryOutput = document.getElementById("binaryOutput").textContent;
        const hexOutput = document.getElementById("hexOutput").textContent;
        const outputText = `Binary Output: ${binaryOutput}\nHexadecimal Output: ${hexOutput}`;

        // text file 
        const blob = new Blob([outputText], { type: "text/plain"});
        
        // anchor
        const anchor = document.createElement("a");
        anchor.download = "conversion_output.text";

        // URL for blob 
        anchor.href = window.URL.createObjectURL(blob);

        // append anchor to body and trigger click event
        document.body.appendChild(anchor);
        anchor.click();

        // remove anchor
        document.body.removeChild(anchor);
    }
});