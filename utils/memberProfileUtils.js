const sortTenures = (tenures) => {
  return tenures.sort((a, b) => {
    if (a.year < b.year) {
      return -1;
    } else if (a.year > b.year) {
      return 1;
    } else if (
      (a.semester === "Spring" && (b.semester === "Spring" || b.semester === "Fall")) ||
      (a.semester === "Summer" && b.semester === "Fall")
    ) {
      return -1;
    } else {
      return 1;
    }
  });
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

  return {semester, year};
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

export {sortTenures, getCurrSemesterYear, convertToBase64};
