export const githubCallback = (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

export const me = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    res.json(req.user);
};

export const logout = (req, res) => {
    req.logout(() => {
        res.json({
            message: "Logged out",
        });
    });
};