using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TeamTravelBackend.Constants;

namespace TeamTravelBackend.Infrastructure.Attributes
{
    public class CarPlateValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object carPlates, ValidationContext validationContext)
        {
            string[] carPlatesArray = carPlates as string[];

            try {
                if (carPlatesArray.All(plate => Regex.IsMatch(plate, DataRequirements.CarPlatePattern)))
                {
                    return ValidationResult.Success;
                }
                else return new ValidationResult(ErrorMessage);
            }
            catch (ArgumentNullException) {
                return new ValidationResult(ErrorMessage);
            }
        }
    }
}
