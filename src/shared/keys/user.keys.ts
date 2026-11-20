export const UserMessages = {
  NOT_FOUND: 'User not found.',
  ALREADY_EXISTS: 'User already exists.',
  SESSION_NOT_FOUND: 'User Session not found.',
  DISABLED: 'User is disabled.',
  ENABLED: 'User is enabled.',
  DELETED: 'User is deleted.',
  // OTP and Email Verification Messages
  USER_NOT_FOUND_SIGNUP: 'User not found. Please sign up first.',
  EMAIL_ALREADY_VERIFIED: 'Email is already verified',
  OTP_REQUEST_TOO_FREQUENT: 'OTP request too frequent. Please wait.',
  INVALID_OTP_OR_EMAIL: 'Invalid OTP or email',
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_MOBILE: 'Invalid mobile number.',
  INVALID_OTP: 'Invalid OTP.',
  OTP_EXPIRED: 'OTP has expired',
  EMAIL_VERIFICATION_REQUIRED:
    'Please verify your email before logging in. Check your inbox for OTP.',
};

export const AuthMessages = {
  INVALID_EMAIL: 'Invalid email address.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  INVALID_CREDENTIALS_ERROR: 'Invalid email or password.',
  AUTH_HEADER_NOT_FOUND: 'Authorization header not found.',
  AUTH_HEADER_IS_NOT_BEARER: "Authorization header is not of type 'Bearer'.",
  INVALID_AUTH_HEADER_BEARER:
    "Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.",
  SESSION_NOT_FOUND: 'Session not found.',
  SESSION_ALREADY_EXPIRED: 'Session is already expired.',
  SESSION_EXPIRED: 'Session is expired.',
  USER_NOT_FOUND: 'User not found.',
  TOKEN_EXPIRED: 'Token is expired please try again',
  LOGOUT_SUCCESS: 'Logout successful.',
  EMAIL_EXIST: 'Entered email already exist in system.',
  TOKEN_IS_EXPIRED: 'Token has been expired. Please try again.',
  INVALID_PASSWORD_ERROR: 'Current password is incorrect.',
  AUTH_ERROR: 'Authentication token invalid.',
  // Success Messages
  ACCOUNT_CREATED_SUCCESS: 'Account created successfully.',
  LOGIN_SUCCESS: 'User logged in successfully',
  ADMIN_NOT_FOUND: 'Admin not found.',
};

export const CategoryMessages = {
  NOT_FOUND: 'Category not found.',
  DELETED: 'Category is deleted.',
  ALREADY_EXISTS: 'Category name already exists.',
  INVALID_NAME: 'Category name is required.',
  DELETED_SUCCESS: 'Category deleted successfully.',
};

export const ProductMessages = {
  NOT_FOUND: 'Product not found.',
  DELETED: 'Product is deleted.',
  ALREADY_EXISTS: 'Product name already exists for this category.',
  INVALID_NAME: 'Product name is required.',
  INVALID_CATEGORY: 'Valid category is required.',
  DELETED_SUCCESS: 'Product deleted successfully.',
};

export const AppSettingMessages = {
  NOT_FOUND: 'App setting not found.',
  UPDATED: 'App settings updated successfully.',
  INVALID_KEY: 'Invalid app setting key.',
};

export const AddressMessages = {
  NOT_FOUND: 'Address not found.',
  DELETED: 'Address is deleted.',
  DELETED_SUCCESS: 'Address deleted successfully.',
  CREATED_SUCCESS: 'Address created successfully.',
  UPDATED_SUCCESS: 'Address updated successfully.',
  ALREADY_DEFAULT: 'This address is already set as default.',
  DEFAULT_UPDATED_SUCCESS: 'Default address updated successfully.',
  CANNOT_DELETE_LAST_ADDRESS: 'You must have at least one saved address.',
};

export const DriverMessages = {
  NOT_FOUND: 'Driver not found.',
  DISABLED: 'Driver account is disabled.',
  SUSPENDED: 'Driver account is suspended.',
  ALREADY_EXISTS: 'Driver already exists.',
  SESSION_NOT_FOUND: 'Driver session not found.',
  DELETED: 'Driver is deleted.',
  // OTP
  OTP_SENT: 'OTP sent successfully.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_ALREADY_USED: 'OTP has already been used.',
  OTP_REQUEST_TOO_FREQUENT: 'OTP request too frequent. Please wait.',
  INVALID_PHONE: 'Invalid phone number. Must be a valid 10-digit Indian number.',
  // Orders
  ORDER_NOT_ASSIGNED: 'This order is not assigned to you.',
  ORDER_INVALID_STATUS: 'Invalid order status transition.',
  DELIVERY_OTP_INVALID: 'Invalid delivery OTP.',
  DELIVERY_OTP_VERIFIED: 'Delivery OTP already verified.',
  // Profile
  PROFILE_UPDATED: 'Profile updated successfully.',
  PHOTO_UPDATED: 'Profile photo updated successfully.',
  STATUS_UPDATED: 'Online status updated.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  LOGOUT_SUCCESS: 'Logout successful.',
};
