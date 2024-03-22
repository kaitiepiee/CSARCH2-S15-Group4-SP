$(document).ready(function() {
    
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

});