export default function FormatIndianRupees(number: Number) {
  console.log(number);
  const rupees = Math.abs(Number(number)) || 0;
  const formattedRupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(rupees);

  return formattedRupees;
}

export function FormatDubaiCurrency(number: Number) {
  console.log(number);
  const rupees = Math.abs(Number(number)) || 0;
  const formattedRupees = new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
  }).format(rupees);

  return formattedRupees;
}
