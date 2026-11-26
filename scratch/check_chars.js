function checkChar(str) {
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0');
        console.log(str[i], `U+${code}`);
    }
}

console.log("Checking ھ:");
checkChar("ھ");

console.log("Checking ہ:");
checkChar("ہ");

console.log("Checking پھول:");
checkChar("پھول");

console.log("Checking پہول:");
checkChar("پہول");
