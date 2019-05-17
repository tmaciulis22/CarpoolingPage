using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace TeamTravelBackend.Models
{
    public class PasswordCrypt
    {
        static public string EncryptPassword(string password)
        {
            // Create the salt value with a cryptographic PRNG
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            // Create the Rfc2898DeriveBytes and get the hash value
            var passBytes = new Rfc2898DeriveBytes(password, salt, 10000);
            byte[] hash = passBytes.GetBytes(20);

            // Combine the salt and password bytes for later use
            byte[] hashBytes = new byte[36];
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 20);

            // Turn the combined salt+hash into a string for storage
            return Convert.ToBase64String(hashBytes);
        }

        static public bool ComparePasswords(string hashedPassword, string userInput)
        {
            // Extract the bytes
            byte[] hashBytes = Convert.FromBase64String(hashedPassword);

            // Get the salt
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            // Compute the hash on the password the user entered
            var passBytes = new Rfc2898DeriveBytes(userInput, salt, 10000);
            byte[] hash = passBytes.GetBytes(20);

            // Compare the results
            for (int i = 0; i < 20; i++)
                if (hashBytes[i + 16] != hash[i])
                    return false;

            return true;
        }
    }
}
