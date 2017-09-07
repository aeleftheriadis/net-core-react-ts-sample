namespace admin.Services
{
    public interface IEncryptionService
    {
        string EncryptString(string text);

        string DecryptString(string cipherText);

    }
}