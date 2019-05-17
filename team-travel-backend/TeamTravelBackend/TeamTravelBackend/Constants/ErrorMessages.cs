namespace TeamTravelBackend.Constants
{
    public static class ErrorMessages
    {
        public const string EmailMissing = "Email address is required!";
        public const string EmailBadFormat = "Provide a valid email adress!";
        public const string EmailTaken = "Provided email address is already taken!";
        public const string PasswordMissing = "Password is required!";
        public const string PasswordTooShort = "Password must be at least 8 characters long!";
        public const string PasswordBadFormat = "Password must contain at least one upper case letter and a digit!";
        public const string BadOldPassword = "Provided old password is not correct!";
        public const string FullNameMissing = "First name and/or surname is required!";
        public const string FullNameTooLong = "First name and surname combined mustn't be longer than 100 characters!";
        public const string PhoneNumberBadFormat = "Provide a valid phone number! Minimum 4 digits, only symbols (, ),  , +, -, /, ., : are allowed";
        public const string PhoneNumberExists = "This phone number is already registered";
        public const string CarPlateBadFormat = "Provide a valid car plate!";
        public const string GeneralError = "Error!";
        public const string LeavingDateNotFound = "Please provide your trip's leaving date!";
        public const string CommentsTooLong = "Please provide a shorter comment for your trip!";
        public const string JoinOwnTrip = "Joining your own trip is not allowed!";
        public const string JoinPastTrip = "Joining a trip from the past is not allowed!";
        public const string UserDoesNotExist = "User does not exist";
        public const string RoleIdNotFound = "Please provide user's role!";
        public const string CarPlateExists = "This car is owned by someone else: ";
        public const string CarPlateHasTrips = "This car has trips and can't be deleted: ";
        public const string NoAvailableSeatsLeft = "Sorry, but there are no available seats left in this trip. Please refresh page to see updated available seats number";
    }
}
