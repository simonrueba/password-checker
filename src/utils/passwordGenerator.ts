export function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  excludeAmbiguous: boolean
): string {
  let charset = 'abcdefghijklmnopqrstuvwxyz'
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeNumbers) charset += '0123456789'
  if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?~'
  if (excludeAmbiguous) charset = charset.replace(/[Il1O0]/g, '')

  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return password
}

