import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, UserCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { userService } from '@/services/api/userService'

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])

  const checkAuthStatus = async () => {
    try {
      const authenticated = await userService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const userData = await userService.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await userService.logout()
      setIsAuthenticated(false)
      setUser(null)
      setIsOpen(false)
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
    }
  }

  const handleProfileClick = () => {
    setIsOpen(false)
    navigate('/profile')
  }

  const handleLogin = () => {
    setIsOpen(false)
    toast.info('Login functionality coming soon!')
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleDropdown()
    }
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
    )
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
className="flex items-center space-x-2 p-2 rounded-full bg-card hover:bg-card-hover border border-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isAuthenticated ? `Profile menu for ${user?.name}` : 'Account menu'}
      >
        {isAuthenticated && user ? (
          <>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                {userService.getUserInitials(user.name)}
              </div>
            )}
<span className="hidden sm:block text-sm font-medium text-foreground">
              {user.name}
            </span>
          </>
        ) : (
          <>
            <UserCircle className="w-8 h-8 text-foreground-secondary" />
            <span className="hidden sm:block text-sm font-medium text-foreground-secondary">
              Guest
            </span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-theme border border-border py-2 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="profile-menu"
        >
          {isAuthenticated ? (
            <>
<div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-foreground-secondary">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary rounded-full text-white">
                  {user?.subscription?.type}
                </span>
              </div>

              {/* Menu Items */}
              <button
onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-foreground-secondary hover:bg-card-hover hover:text-foreground transition-colors duration-150"
                role="menuitem"
              >
                <User className="w-4 h-4 mr-3" />
                View Profile
              </button>

              <button
                onClick={() => {
                  setIsOpen(false)
                  toast.info('Settings page coming soon!')
                }}
className="flex items-center w-full px-4 py-2 text-sm text-foreground-secondary hover:bg-card-hover hover:text-foreground transition-colors duration-150"
                role="menuitem"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>

<hr className="my-1 border-border" />

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-foreground-secondary hover:bg-card-hover hover:text-foreground transition-colors duration-150"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
onClick={handleLogin}
                className="flex items-center w-full px-4 py-2 text-sm text-foreground-secondary hover:bg-card-hover hover:text-foreground transition-colors duration-150"
                role="menuitem"
              >
                <User className="w-4 h-4 mr-3" />
                Sign In
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false)
                  toast.info('Sign up functionality coming soon!')
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-foreground-secondary hover:bg-card-hover hover:text-foreground transition-colors duration-150"
                role="menuitem"
              >
                <UserCircle className="w-4 h-4 mr-3" />
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileButton