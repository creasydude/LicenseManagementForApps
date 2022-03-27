const LicenseGenerator = (num: number) => {
  const licenseArray = [];
  for (let i = 0; i < num; i++) {
    const chars = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];
    licenseArray.push(
      `${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }-${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }-${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }-${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }${chars[Math.floor(Math.random() * 35)]}${
        chars[Math.floor(Math.random() * 35)]
      }`
    );
  }
  return licenseArray;
};

export default LicenseGenerator;
