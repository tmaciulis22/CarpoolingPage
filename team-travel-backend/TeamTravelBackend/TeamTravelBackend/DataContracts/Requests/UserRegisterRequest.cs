using System.ComponentModel.DataAnnotations;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Infrastructure.Attributes;

namespace TeamTravelBackend.DataContracts.Requests
{
    public class UserRegisterRequest
    {
        [Required(ErrorMessage = ErrorMessages.EmailMissing)]
        [EmailAddress(ErrorMessage = ErrorMessages.EmailBadFormat)]
        public string Email { get; set; }
        [Required(ErrorMessage = ErrorMessages.PasswordMissing)]
        [MinLength(DataRequirements.PasswordMinLength, ErrorMessage = ErrorMessages.PasswordTooShort)]
        [RegularExpression(DataRequirements.PasswordPattern, ErrorMessage = ErrorMessages.PasswordBadFormat)]
        public string Password { get; set; }
        [Required(ErrorMessage = ErrorMessages.FullNameMissing)]
        [MaxLength(DataRequirements.FullNameMaxLength, ErrorMessage = ErrorMessages.FullNameTooLong)]
        public string FullName { get; set; }
        [MaxLength(50)]
        public string SlackId { get; set; }
        [RegularExpression(DataRequirements.CarPlatePattern, ErrorMessage = ErrorMessages.CarPlateBadFormat)]
        public string CarPlate { get; set; }
        [RegularExpression(DataRequirements.PhoneNumberPattern, ErrorMessage = ErrorMessages.PhoneNumberBadFormat)]
        public string Phone { get; set; }
    }
}
