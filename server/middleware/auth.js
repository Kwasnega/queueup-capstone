import jwt from 'jsonwebtoken';

const ADMIN_ROLES = ['SuperAdmin', 'HOD', 'ExamOfficer'];

function authenticateToken(request, response, next) {
  const authorization = request.headers.authorization;
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authorization token is required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return response.status(500).json({ message: 'Authentication is not configured' });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired authorization token' });
  }
}

function requireRole(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user?.role)) {
      return response.status(403).json({ message: 'You do not have permission to access this resource' });
    }

    return next();
  };
}

export { ADMIN_ROLES, authenticateToken, requireRole };
