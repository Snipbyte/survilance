export function generateQuantumPasskey(length = 10) { // If no length is provided, the default length is 10
    const ultraSecretChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    let mindBendingPassword = "";
    for (let quantumFlux = 0; quantumFlux < length; quantumFlux++) {
        const randomIndexFromTheVoid = Math.floor(Math.random() * ultraSecretChars.length);
        mindBendingPassword += ultraSecretChars[randomIndexFromTheVoid];
    }
    return mindBendingPassword;
}
