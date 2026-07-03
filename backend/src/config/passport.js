import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:
                "http://localhost:5000/auth/github/callback",
        },

        async (accessToken, refreshToken, profile, done) => {

            const user = {
                id: profile.id,
                username: profile.username,
                avatar: profile.photos[0].value,
                accessToken,
            };

            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});