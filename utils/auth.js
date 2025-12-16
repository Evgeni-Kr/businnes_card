function requireRole(user, role) {
    if (!user || user.getRole() !== role) {
        throw new Error('Access denied');
    }
}

module.exports = { requireRole };
