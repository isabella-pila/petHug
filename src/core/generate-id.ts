
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36); 
  const randomPart = Math.random().toString(36).substr(2); 

  return timestamp + randomPart;
}