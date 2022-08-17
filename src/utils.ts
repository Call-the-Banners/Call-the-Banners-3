export function chunk<T>(arr: T[], size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export function decimalCheck<T>(num: number, decimal: number) {
  return num.toFixed(decimal).replace(/[.,]00$/, "");
}

export function getMedal(num: number) {
  switch (num) {
    case 1:
      return ":first_place:";
    case 2:
      return ":second_place:";
    case 3:
      return ":third_place:";
  }

  return num;
}
