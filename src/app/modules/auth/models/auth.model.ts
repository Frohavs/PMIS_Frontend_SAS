export class AuthModel {
  id: string;
  token: string;
  authToken?: string;
  email: string;
  displayName: string;
  role: string;
  refreshToken?: string;
  expiresIn?: Date;

  setAuth(auth: AuthModel) {
    this.id = auth.id;
    this.token = auth.token;
    this.authToken = auth.authToken;
    this.email = auth.email;
    this.displayName = auth.displayName;
    this.role = auth.role;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
