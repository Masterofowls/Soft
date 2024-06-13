// для проверки тестов и страйкера.
// для тестов используем jest. 
// все файлы нашей работы находятся в файле src для того чтобы stryker их видел.

export default function plus(a, b) {
  if (
    (!a && a !== 0) ||
    (!b && b !== 0) ||
    typeof a !== 'number' ||
    typeof b !== 'number'
  ) {
    return;
  }
  return a + b;
}
