type ClerkError = {
   errors?: { code?: string }[];
};

export function handleClerkError(
   err: ClerkError,
   setError: (msg: string) => void,
   defaultMsg = "Something went wrong. Please try again."
) {
   const code = err?.errors?.[0]?.code;

   switch (code) {
      case "form_code_incorrect":
      case "form_code_expired":
         return setError("Invalid or expired code. Please request a new one.");
      case "form_identifier_not_found":
         return setError("No account found with this email.");
      case "form_password_incorrect":
         return setError("Incorrect password. Please try again.");
      case "form_param_format_invalid":
         return setError("Invalid input format. Please check your data.");
      case "form_password_pwned":
         return setError("This password is not secure. Please choose another.");
      case "form_identifier_exists":
         return setError(
            "An account with this email or phone number already exists."
         );
      case "form_username_invalid_character":
         return setError("Username contains invalid characters.");
      case "form_username_invalid_length":
         return setError("Username must be between 3 and 32 characters.");
      default:
         console.error(
            "Unhandled Clerk Error:",
            JSON.stringify(err?.errors, null, 2)
         );
         return setError(defaultMsg);
   }
}
