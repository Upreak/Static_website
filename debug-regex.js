// Debug phone number regex
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}(\s*\(.*\))?$/;
const phone = '+91 99013 81877 (WhatsApp only)';

console.log('Testing phone:', phone);
console.log('Regex test:', phoneRegex.test(phone));
console.log('Phone length:', phone.length);
console.log('Phone digits only:', phone.replace(/\D/g, ''));

// Test different parts
console.log('\n--- Testing different parts ---');
console.log('Just digits:', '+919901381877');
console.log('Just digits test:', phoneRegex.test('+919901381877'));

console.log('With space:', '+91 9901381877');
console.log('With space test:', phoneRegex.test('+91 9901381877'));

console.log('With dash:', '+91-9901381877');
console.log('With dash test:', phoneRegex.test('+91-9901381877'));

// Test the actual digits in the phone
const digitsOnly = phone.replace(/\D/g, '');
console.log('Digits only:', digitsOnly);
console.log('Digits length:', digitsOnly.length);
console.log('Digits only test:', phoneRegex.test(digitsOnly));

// Test with simpler regex
const simpleRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}$/;
console.log('\n--- Simple regex test ---');
console.log('Simple regex test:', simpleRegex.test(phone));
console.log('Simple regex test with digits:', simpleRegex.test(digitsOnly));