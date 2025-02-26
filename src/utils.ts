export const errors = {
    EMAIL_ALREADY_EXISTS: 'User already exists',
    INVALID_NAME: 'Invalid name',
    INVALID_EMAIL: 'Invalid email',
    INVALID_CPF: 'Invalid cpf',
    INVALID_CAR_PLATE: 'Invalid car plate'
}

export function validateName(name: string): boolean {
    return !!name.match(/[a-zA-Z] [a-zA-Z]+/)?.length
};
export function validateEmail(email: string): boolean {
    return !!email.match(/^(.+)@(.+)$/)?.length
};
export function validateCarPlate(carPlate: string): boolean {
    return !!carPlate.match(/[A-Z]{3}[0-9]{4}/)?.length
};