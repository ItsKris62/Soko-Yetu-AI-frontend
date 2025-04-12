// central role redirect helper

export const redirectToDashboard = (role: string) => {
    switch (role) {
      case 'farmer':
        return '/farmer-dashboard'
      case 'buyer':
        return '/buyer-dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/dashboard'
    }
  }
  