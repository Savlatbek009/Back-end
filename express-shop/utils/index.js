import moment from "moment";

export default {
  ifequal(a, b, options) {
    if (a == b) {
      return options.fn(this);
    }

    return options.inverse(this);
  },
  getFullName(firstName) {
    return firstName.charAt(0);
  },
  formatData(date) {
    return moment(date).format("DD MMM, YYYY");
  },
};
