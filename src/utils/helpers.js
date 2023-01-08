export const getError = (data) => {
  let message = "";
  if (data.message) {
    message = data.message;
  } else {
    for (const [key, value] of Object.entries(data.errors)) {
      if (message !== "") {
        message += "<br />";
      }
      message += value;
    }
  }
  return message;
};
