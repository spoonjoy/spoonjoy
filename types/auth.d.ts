// TODO Find out if there's a better way to type the following few things
/** Because it's not exposed by @redwoodjs - find the original in DbAuthHandler.d.ts */

// I couldn't figure out how to make the below work
// interface ISignupHandlerInput<ExtraAttrs extends Record<string, string>> {
//   username: string
//   hashedPassword: string
//   salt: string
//   userAttributes: ExtraAttrs | undefined
// }
export interface IExtraSignupAttributes {
  email: string
}

export interface IFormSignup extends IExtraSignupAttributes {
  username: string
  password: string
}

export interface IFormSignin {
  username: string
  password: string
}
