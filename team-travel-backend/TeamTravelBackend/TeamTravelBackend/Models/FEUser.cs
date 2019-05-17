using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Infrastructure.Attributes;

namespace TeamTravelBackend.Models
{
    public class FEUser
    {
        public int Id { get; set; }
        [Required(ErrorMessage = ErrorMessages.FullNameMissing)]
        [MaxLength(DataRequirements.FullNameMaxLength, ErrorMessage = ErrorMessages.FullNameTooLong)]
        public string FullName { get; set; }
        [RegularExpression(DataRequirements.PhoneNumberPattern, ErrorMessage = ErrorMessages.PhoneNumberBadFormat)]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = ErrorMessages.EmailMissing)]
        [EmailAddress(ErrorMessage = ErrorMessages.EmailBadFormat)]
        public string Email { get; set; }
        public string SlackId { get; set; }
        public string MainOffice { get; set; }
        [Required(ErrorMessage = ErrorMessages.RoleIdNotFound)]
        public int RoleId { get; set; }
        [CarPlateValidation(ErrorMessage = ErrorMessages.CarPlateBadFormat)]
        public string[] CarPlates { get; set; }
        [MinLength(DataRequirements.PasswordMinLength, ErrorMessage = ErrorMessages.PasswordTooShort)]
        [RegularExpression(DataRequirements.PasswordPattern, ErrorMessage = ErrorMessages.PasswordBadFormat)]
        public string Password { get; set; }
    }
}
