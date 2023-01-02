const sortTenures = (isMemberView) => {
  let splitFunction, compFunction;

  if (isMemberView) {
    splitFunction = (tenure) => {
      return { semester: tenure.semester, year: tenure.year };
    };
    compFunction = (num) => num;
  } else {
    splitFunction = (tenure) => {
      const split = tenure.split(" ");
      return { semester: split[0], year: split[1] };
    };
    compFunction = (num) => num * -1;
  }

  return (a, b) => {
    const { semester: semester1, year: year1 } = splitFunction(a);
    const { semester: semester2, year: year2 } = splitFunction(b);

    if (year1 > year2) return compFunction(1);
    else if (year1 < year2) return compFunction(-1);
    else if (
      (semester1 === "Fall" && semester2 === "Fall") ||
      (semester1 === "Summer" && semester2 === "Summer") ||
      (semester1 === "Spring" && semester2 === "Spring")
    )
      return 0;
    else if (semester1 === "Fall") return compFunction(1);
    else if (semester2 === "Fall") return compFunction(-1);
    else if (semester1 === "Summer") return compFunction(1);
    else return compFunction(-1);
  };
};

const getCurrSemesterYear = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  let semester;
  if ((month >= 0 && month <= 3) || (month == 4 && day <= 14)) {
    semester = "Spring";
  } else if ((month == 4 && day >= 15) || (month >= 5 && month <= 6) || (month == 7 && day <= 14)) {
    semester = "Summer";
  } else {
    semester = "Fall";
  }

  return { semester, year };
};

const convertToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export { sortTenures, getCurrSemesterYear, convertToBase64 };
