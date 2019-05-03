const crypto = require('crypto');

module.exports = {
  encrypt(string) {
    const cipher = crypto.createCipher('aes192', process.env.CRYPTO_SECRET);
    const encrypted = cipher.update(string, 'utf8', 'hex');

    return encrypted + cipher.final('hex');
  },

  decrypt(encrypted) {
    const decipher = crypto.createDecipher('aes192', process.env.CRYPTO_SECRET);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8');

    return decrypted + decipher.final('utf8');
  },
};
