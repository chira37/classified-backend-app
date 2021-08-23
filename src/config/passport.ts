import UserModel from "../models/UserModel";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { httpResponse, roles } from "../utils/constants";
import config from "../config";

passport.use(
    "signUp",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email: string, password: string, done) => {
            try {
                const doc = new UserModel({ email, password, role: roles.USER });
                const res = await doc.save();

                const userDetails = {
                    id: res.id,
                    email: res.email,
                    role: res.role,
                };

                return done(null, userDetails);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "signIn",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) {
                    const error = {
                        message: "User not found",
                        name: "USER_NOT_FOUND",
                        httpCode: httpResponse.NOT_FOUND,
                    };
                    return done(error, false);
                }
                const validate = await user.isValidPassword(password);
                if (!validate) {
                    const error = {
                        message: "Invalid password",
                        name: "INVALID_PASSWORD",
                        httpCode: httpResponse.UNAUTHORIZED,
                    };
                    return done(error, false);
                }

                const userDetails = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };

                return done(null, userDetails);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: config.jwtSecrete,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
        },
        async (token, done) => {
            try {
                return done(null, token);
            } catch (error) {
                done(error);
            }
        }
    )
);
