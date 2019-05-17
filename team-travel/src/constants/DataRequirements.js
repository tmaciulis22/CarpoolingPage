//Define all data requirements
const passwordMinLength = 8;
const passwordPattern = '^(?=.*\\d)(?=.*[A-Z])(.+)$';
const emailPattern = '^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
const nameMaxLength = 50;
const phonePattern = '^[ ()+-/.:]*([0-9][ ()+-/.:]*){4,}$';
const carPlatePattern = '^[A-Za-z0-9]+$';

//Make groups of requirements for different actions / components / pages ...
export const RegistrationRequirements = {
    passwordMinLength,
    passwordPattern,
    emailPattern,
    nameMaxLength,
    phonePattern,
    carPlatePattern
}

export const LoginRequirements = {
    //Add requirements
}

export const UserSettingsRequirements = {
    nameMaxLength,
    phonePattern,
    passwordMinLength,
    passwordPattern,
    carPlatePattern
}

export const AdminPanelRequirements = {
    nameMaxLength,
    phonePattern,
    emailPattern,
    carPlatePattern
}