namespace TeamTravelBackend.Constants
{
    public static class DataRequirements
    {
        public const short PasswordMinLength = 8;
        public const string PasswordPattern = @"^(?=.*\d)(?=.*[A-Z])(.+)$";
        public const short FullNameMaxLength = 101; // MaxLength of FirstName in FE (50) + space (1) + MaxLength of LastName in FE (50)
        public const string PhoneNumberPattern = @"^[ ()+-/.:]*([0-9][ ()+-/.:]*){4,}$";
        public const string CarPlatePattern = @"^[A-Za-z0-9]+$";
        public const short CommentsMaxLength = 200;
    }
}
