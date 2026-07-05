import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../lib/prisma.js";

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:
                `${process.env.YOUR_PUBLIC_URL}/auth/github/callback`,
        },

        async (accessToken, refreshToken, profile, done) => {

            const existingUser = await prisma.user.findUnique({
    where: {
        githubId: profile.id,
    },
});
        let user;
       if(existingUser){ user = await prisma.user.update({
    where: {
        githubId: profile.id,
    },
    data: {
        username: profile.username,
        avatarUrl: profile.photos?.[0]?.value,
        accessToken,
    },
});
       }
       else{
        user = await prisma.user.create({
    data: {
        githubId: profile.id,
        username: profile.username,
        avatarUrl: profile.photos?.[0]?.value,
        accessToken,
    },
});
       }
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        done(null, user);

    } catch (err) {

        done(err);

    }

});