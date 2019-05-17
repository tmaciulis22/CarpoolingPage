using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
//using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Infrastructure.Attributes;

namespace TeamTravelBackend.Models
{
    public class FETrip
    {
        public int?         ID            { get; set; }
        [Required(ErrorMessage = ErrorMessages.GeneralError)]
        public int          DriverID      { get; set; }
        [MaxLength(DataRequirements.FullNameMaxLength, ErrorMessage = ErrorMessages.FullNameTooLong)]
        public string       Driver        { get; set; }
        [Required(ErrorMessage = ErrorMessages.GeneralError)]
        public string       Origin        { get; set; }
        [Required(ErrorMessage = ErrorMessages.GeneralError)]
        public string       Destination   { get; set; }
        [Required(ErrorMessage = ErrorMessages.LeavingDateNotFound)]
        public DateTime     LeavingDate   { get; set; }
        public DateTime?    ReturnDate    { get; set; }
        public int          MaxSeats      { get; set; }
        [RegularExpression(DataRequirements.CarPlatePattern, ErrorMessage = ErrorMessages.CarPlateBadFormat)]
        public string       CarPlate      { get; set; }
        [Required(ErrorMessage = ErrorMessages.GeneralError)]
        public string       CarType       { get; set; }
        [Required(ErrorMessage = ErrorMessages.GeneralError)]
        public string       Status        { get; set; }
        [MaxLength(DataRequirements.CommentsMaxLength, ErrorMessage = ErrorMessages.CommentsTooLong)]
        public string       Comments      { get; set; }
        public string       PhoneNumber   { get; set; }
        public string       SlackId       { get; set; }
        public List<FEPassenger> Passengers { get; set; }

    }
}
