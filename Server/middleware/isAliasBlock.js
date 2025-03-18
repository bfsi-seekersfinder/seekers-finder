
const checkIfAliasBlocked = async (req, res, next) => {
    const user = await aliasUserModel.findById(req.session.id);

    if (user.block) {
        return res.status(403).json({ message: "Your account is blocked. Contact support." });
    }

    next();
};

export default checkIfAliasBlocked;