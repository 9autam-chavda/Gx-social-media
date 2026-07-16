import { actionIcons } from '../icons/iconMap';

const createNavItem = (label, to, icon, activeIcon = icon) => ({ label, to, icon, activeIcon });

export const desktopSidebarNavItems = [
  createNavItem('Home', '/feed', actionIcons.home, actionIcons.homeActive),
  createNavItem('Explore', '/explore', actionIcons.explore, actionIcons.exploreActive),
  createNavItem('Create', '/create-post', actionIcons.create),
  createNavItem('Messages', '/messages', actionIcons.messages, actionIcons.messagesActive),
];

export const mobileBottomNavItems = [
  createNavItem('Home', '/feed', actionIcons.home, actionIcons.homeActive),
  createNavItem('Explore', '/explore', actionIcons.explore, actionIcons.exploreActive),
  createNavItem('Create', '/create-post', actionIcons.create),
  createNavItem('Messages', '/messages', actionIcons.messages, actionIcons.messagesActive),
];

export const getProfileNavItem = (profilePath) => createNavItem('Profile', profilePath, actionIcons.profile, actionIcons.profileActive);
