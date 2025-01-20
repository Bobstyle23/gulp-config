import hello from "./modules/hello.js";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeEn from "air-datepicker/locale/en";

new AirDatepicker("#date-picker", {
  locale: localeEn,
});

console.log("Hello Index");
console.log(hello);
