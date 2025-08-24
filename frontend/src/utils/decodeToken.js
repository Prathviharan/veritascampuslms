export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // return full payload (which includes id, role, etc.)
  } catch (err) {
    console.error("Failed to decode token", err);
    return {};
  }
};

