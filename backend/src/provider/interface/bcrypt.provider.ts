interface IBcryptProvider {
  hash(password: string): Promise<string>;
  compare(password: string, hashedpassword: string): Promise<boolean>;
}
