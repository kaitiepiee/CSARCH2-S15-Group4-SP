$(document).ready(function() {

    // JQuery selector/function for converting input
    $(".convert-button").click(function() {
        convert();
    });

    // JQuery selector/function for downloading output
    $(".download-button").click(function() {
        downloadOutput();
    });

    // Decimal-128 Floating Point Converter
    // 128-bit: MSb for sign, next 5 for continuation bit, next 12 for exponent continuation bit, and 110 for mantissa combination bit
    function convert() {

        // ------------------------------------[INITIALIZATION]---------------------------------------
        // 1. Decimal
        // 2. Base 10
        // 3. Normalize to 34 whole digits
        // 4. E' = E + 6176
        // Get Input
        let decimalInput = document.getElementById("decimalInput").value;
        let exponentInput = parseInt(document.getElementById("exponentInput").value);

        let msb = decimalInput < 0 ? 1 : 0;

        // Remove the negative sign if it exists
        if (msb === 1) {
            decimalInput = decimalInput.substring(1);
        }

        decimalInput = decimalInput.toString();

        // Normalize
        if (decimalInput.includes('.')) {
            console.log("AAAAAAAAAAdecimalInput: " + decimalInput + " exponentInput: " + exponentInput);
            let decimalIndex = decimalInput.indexOf('.');
            let digitsAfterDecimal = decimalInput.length - decimalIndex - 1;
            decimalInput = decimalInput.slice(0, decimalIndex) + decimalInput.slice(decimalIndex + 1);
            exponentInput -= digitsAfterDecimal;
            console.log("BBBBBBBBBBBBBBBBBdecimalInput: " + decimalInput + " exponentInput: " + exponentInput);
        }

        // Special cases handling after normalization
        if (exponentInput > 6111) {
            // Infinity case
            displaySpecialOutput(decimalInput < 0 ? '1' : '0', '11110' + '00000000000', 'Infinity');
            return;
        }

        if (exponentInput < -6176) {
            // Lower infinity (N/A) case
            displaySpecialOutput('N/A', 'N/A', 'N/A');
            return;
        }

        if (isNaN(exponentInput)) {
            // Invalid input case
            displaySpecialOutput('X', '11111' + '00000000000', 'NaN');
            return;
        }

        // Remove the leading 0s from whole number
        decimalInput = parseInt(decimalInput).toString();

        while (decimalInput.endsWith('0') && decimalInput.length > 1) {
            decimalInput = decimalInput.slice(0, -1);
            exponentInput++;
        }

        /* TODO: CHANGE TO 34
        single: 7
        double: 16
        */
        decimalInput = decimalInput.padStart(34, '0');

        /* TODO: CHANGE TO 6176
        single: 101
        double: 398
        */
        var e_prime = exponentInput + 6176;
        // -----------------------------------------[END]---------------------------------------------


        // --------------------------------------[CONVERSION]-----------------------------------------
        var output = [128];
        
        // OUTPUT
        //document.getElementById("binaryOutput").textContent = "place the binary output here";
        //document.getElementById("hexOutput").textContent = "place the hex output here";

        document.getElementById("decimalDisplay").textContent = "Decimal Input: " + decimalInput;
        document.getElementById("exponentDisplay").textContent = "Exponent Input: " + exponentInput;

        // MSD (Leftmost) CHECK
        var decimalInputString = decimalInput;
        if (decimalInputString[0] === '0') {
            var leftmostDigit = '0';
        } else {
            var leftmostDigit = decimalInputString[0];
        }
        var binaryLeftmostDigit = parseInt(leftmostDigit).toString(2).padStart(4, '0');
        document.getElementById("binaryOutputDisplay").textContent = "Binary MSD Output: " + leftmostDigit + " = " + binaryLeftmostDigit;


        // E' to BINARY
        var binaryEPrime = e_prime.toString(2);
        console.log("e_prime:" + e_prime + "binaryEPrime: " + binaryEPrime);

        /* TODO: CHANGE TO 14
        single = 8
        double = 10
        */
        var padSize = 14 - binaryEPrime.length;
        if (padSize < 0) padSize = 0;
        var paddedBinaryEPrime = binaryEPrime.padStart(binaryEPrime.length + padSize, '0');
        document.getElementById("EPrimeOutputDisplay").textContent = "Binary E Prime Output: " + e_prime + " = " + paddedBinaryEPrime;

        // COMBINATION BIT
        if (leftmostDigit >= 0 && leftmostDigit <= 7) {
            var expMSB = paddedBinaryEPrime.slice(0, 2);
            var coefMSD = binaryLeftmostDigit.slice(-3);
            var combinationBit = expMSB + coefMSD;
        }

        else if (leftmostDigit >= 8 && leftmostDigit <= 9) {
            var expMSB = paddedBinaryEPrime.slice(0, 2);
            var coefMSD = binaryLeftmostDigit.slice(-1);
            var combinationBit = '11' + expMSB + coefMSD;
        }

        document.getElementById("combinationOutputDisplay").textContent = "\nCombination Bit: " + combinationBit;

        // EXPONENT
        var binaryExponent = paddedBinaryEPrime.slice(2);
        /*TODO: MAKE 12
        single = 6
        double = 8
        */
        var exponentContinuationBit = binaryExponent.padEnd(12, '0');
        document.getElementById("exponentContinuationBitDisplay").textContent = "Exponent Continuation Bit: " + exponentContinuationBit;

        
        // BCD
        var densePackedBCD = '';

        for (var i = 1; i < decimalInputString.length; i += 3) {
            var BCD = decimalInputString.substring(i, i + 3);
        
            console.log("BCD: " + BCD);
            var binaryBCD = '';
            for (var j = 0; j < BCD.length; j++) {
                var binaryDigit = parseInt(BCD[j]).toString(2).padStart(4, '0');
                binaryBCD += binaryDigit;
            }
            
            binaryBCD = binaryBCD.trim();
            document.getElementById("binaryBCDDisplay").textContent = "Binary BCD: " + BCD + " = " + binaryBCD;
        
            var key = binaryBCD[0] + binaryBCD[4] + binaryBCD[8];

            switch (key) {
                case '000':
                    var output = binaryBCD[1] + binaryBCD[2] + binaryBCD[3] + binaryBCD[5] + binaryBCD[6] + binaryBCD[7] + '0' + binaryBCD[9] + binaryBCD[10] + binaryBCD[11];
                    console.log('A: ' + output);
                    densePackedBCD += output;
                    break;
                case '001':
                    var output = binaryBCD[1] + binaryBCD[2] + binaryBCD[3] + binaryBCD[5] + binaryBCD[6] + binaryBCD[7] + '1' + '0' + '0' + binaryBCD[11];
                    console.log('B: ' + output);
                    densePackedBCD += output;
                    break;
                case '010':
                    var output = binaryBCD[1] + binaryBCD[2] + binaryBCD[3] + binaryBCD[9] + binaryBCD[10] + binaryBCD[7] + '1' + '0' + '1' + binaryBCD[11];
                    console.log('C' + output);
                    densePackedBCD += output;
                    break;
                case '011':
                    var output = binaryBCD[1] + binaryBCD[2] + binaryBCD[3] + '1' + '0' + binaryBCD[7] + '1' + '1' + '1' + binaryBCD[11];
                    console.log('D' + output);
                    densePackedBCD += output;
                    break;
                case '100':
                    var output = binaryBCD[9] + binaryBCD[10] + binaryBCD[3] + binaryBCD[5] + binaryBCD[6] + binaryBCD[7] + '1' + '1' + '0' + binaryBCD[11];
                    console.log('E' + output);
                    densePackedBCD += output;
                    break;
                case '101':
                    var output = binaryBCD[5] + binaryBCD[6] + binaryBCD[3] + '0' + '1' + binaryBCD[7] + '1' + '1' + '1' + binaryBCD[11];
                    console.log('F' + output);
                    densePackedBCD += output;
                    break;
                case '110':
                    var output = binaryBCD[9] + binaryBCD[10] + binaryBCD[3] + '0' + '0' + binaryBCD[7] + '1' + '1' + '1' + binaryBCD[11];
                    console.log('G' + output);
                    densePackedBCD += output;
                    break;
                case '111':
                    var output = '0' + '0' + binaryBCD[3] + '1' + '1' + binaryBCD[7] + '1' + '1' + '1' + binaryBCD[11];
                    console.log('H' + output);
                    densePackedBCD += output;
                    break;
                default:
                    break;
            }

            //densePackedBCD += ' ';

        }

        console.log("FULL:" + densePackedBCD);
        
        binaryOutput = msb + combinationBit + exponentContinuationBit + densePackedBCD;
        document.getElementById("msb-output").textContent = msb;
        document.getElementById("combi-output").textContent = combinationBit;
        document.getElementById("exp-cont-output").textContent = exponentContinuationBit;
        document.getElementById("bcd-output").textContent = densePackedBCD;

        console.log("ASDFASDFASDF:" + binaryOutput);

        var hexOutput = "";
        for (var i = 0; i < binaryOutput.length; i += 4) {
            var chunk = binaryOutput.slice(i, i + 4);
            var hex = parseInt(chunk, 2).toString(16);
            hexOutput += hex;

            if ((i + 4) % 16 === 0) { 
                hexOutput += ' ';
            }
        }

        hexOutput = hexOutput.toUpperCase();
        console.log("hexOutput: " + hexOutput);
        
        // Display outputs 
        // document.getElementById("binaryOutput").textContent = binaryOutput;
        document.getElementById("hexOutput").textContent = hexOutput;

        // -----------------------------------------[END]---------------------------------------------

    }

    // ---------------------------------------[SPECIAL CASES]------------------------------------------
    function displaySpecialOutput(signBit, combinationBits, specialCase) {
        let binaryOutput, hexOutput;

        if (specialCase === 'Infinity') {
            binaryOutput = `${signBit} ${combinationBits} ${'X'.repeat(110)}`; // Placeholder X's for the rest of the bits
            hexOutput = '-';
        } else if (specialCase === 'NaN') {
            binaryOutput = `X ${combinationBits} ${'X'.repeat(110)}`; // Placeholder X's for the rest of the bits, sign bit is don't care ('X')
            hexOutput = '-';
        } else { // Lower infinity (N/A) case
            binaryOutput = 'N/A';
            hexOutput = 'N/A';
        }

        // Update the display elements with the special case outputs
        document.getElementById("binaryOutput").textContent = binaryOutput; // Formatted as requested
        document.getElementById("hexOutput").textContent = hexOutput;
        document.getElementById("decimalDisplay").textContent = "Decimal Input: " + (specialCase === 'N/A' ? 'N/A' : specialCase);
        document.getElementById("exponentDisplay").textContent = "Exponent Input: " + (specialCase === 'N/A' ? 'N/A' : specialCase);
        document.getElementById("binaryOutputDisplay").textContent = "Binary MSD Output: " + (specialCase === 'N/A' ? 'N/A' : specialCase);
        document.getElementById("EPrimeOutputDisplay").textContent = "Binary E Prime Output: " + (specialCase === 'N/A' ? 'N/A' : '-');
        document.getElementById("combinationOutputDisplay").textContent = "Combination Bit: " + (specialCase === 'N/A' ? 'N/A' : combinationBits);
        document.getElementById("exponentContinuationBitDisplay").textContent = "Exponent Continuation Bit: " + (specialCase === 'N/A' ? 'N/A' : '-');
        document.getElementById("binaryBCDDisplay").textContent = "Binary BCD: " + (specialCase === 'N/A' ? 'N/A' : '-');
    }
    // truncate function
    // round down function
    // round up function
    // round to nearest [ties-to-even] function
    // --------------------------------------------[END]-----------------------------------------------


    // ---------------------------------------[DOWNLOAD OUTPUT]----------------------------------------
    // TODO: fix output file format
    function downloadOutput() {
        // Input values
        var decimalInput = document.getElementById('decimalInput').value;
        var exponentInput = document.getElementById('exponentInput').value;
        // Output content
        var binaryOutput = document.getElementById('binaryOutput').textContent;
        var hexOutput = document.getElementById('hexOutput').textContent;

        // Combine content into a single string
        var content = "INPUT\n" +
                    "Decimal: " + decimalInput + "\n" +
                    "Exponent: " + exponentInput + "\n\n" +
                    "OUTPUT\n" +
                    "Binary Output: " + binaryOutput + "\n" + // TODO: fix the call ID
                    "Hexadecimal Equivalent: " + hexOutput;

        // Create a Blob containing the content
        var blob = new Blob([content], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);

        // Filename
        a.download = 'output.txt'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    // --------------------------------------------[END]-----------------------------------------------

});



