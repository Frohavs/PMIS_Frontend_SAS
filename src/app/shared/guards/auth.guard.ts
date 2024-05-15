import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Check if the user is authenticated
  const isAuthenticated = isUserAuthenticated();

  if (isAuthenticated) {
    return true;
  } else {
    // Redirect the user to the login page
    sessionStorage.clear();
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }
};

function isUserAuthenticated(): boolean {
  // Implement your authentication logic here
  // For now, let's assume the user is always authenticated

  return localStorage.getItem('user') ? true : false;
}
