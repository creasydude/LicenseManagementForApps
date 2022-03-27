/**
 * Generate Random Chars. types : "letters" | "numbers" | "numbers+letters"
 */
const Generator = (type : string ,number : number ) => {
    //types : letters | numbers | numbers+letters 
    const lowerLetters : string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const upperLetters : string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const numbers : string[] = ["0","1","2","3","4","5","6","7","8","9"];

    let finalArr : string[] = [];
    let finalArrLength : number = 0;
    let finalString : string = "";

    if (type === "letters") {
        finalArr = finalArr.concat(lowerLetters,upperLetters);
        finalArrLength = finalArr.length;
    } else if (type === "numbers") {
        finalArr = finalArr.concat(numbers);
        finalArrLength = finalArr.length;
    } else if (type === "numbers+letters") {
        finalArr = finalArr.concat(lowerLetters,numbers,upperLetters);
        finalArrLength = finalArr.length;
    }
    for (let i = 0 ; i < number; i++ ) {
        const randomPick = Math.floor(Math.random() * finalArr.length);
        finalString = finalString.concat(finalArr[randomPick])
    }
    return finalString;
}

export default Generator;