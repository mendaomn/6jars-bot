import Numeral from "numeral";

export function setupLocale(numeral: typeof Numeral) {
  if (numeral.locale() !== "it") {
    numeral.register("locale", "it", {
      delimiters: {
        thousands: ".",
        decimal: ",",
      },
      abbreviations: {
        thousand: "mila",
        million: "mil",
        billion: "b",
        trillion: "t",
      },
      ordinal: function (number) {
        return "º";
      },
      currency: {
        symbol: "€",
      },
    });

    numeral.locale("it");
  }

  return numeral;
}
