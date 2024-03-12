export function validateCpf(value: string) {
  if (value.length !== 11) return false

  const invalidCPF = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ]

  if (invalidCPF.includes(value)) return false

  const firstDigitSum = value
    .split('')
    .slice(0, 9)
    .reduce((acc, digit, index) => {
      return (acc += Number(digit) * (10 - index))
    }, 0)

  const firstDigitCalc = (firstDigitSum * 10) % 11

  const firstDigitCheckNumber = firstDigitCalc >= 10 ? 0 : firstDigitCalc

  if (firstDigitCheckNumber !== Number(value[9])) return false

  const secondDigitSum = value
    .split('')
    .slice(0, 10)
    .reduce((acc, digit, index) => {
      return (acc += Number(digit) * (11 - index))
    }, 0)

  const secondDigitCalc = (secondDigitSum * 10) % 11

  const secondDigitCheckNumber = secondDigitCalc >= 10 ? 0 : secondDigitCalc

  if (secondDigitCheckNumber !== Number(value[10])) return false

  return true
}
