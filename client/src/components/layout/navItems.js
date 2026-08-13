import { actionIcons } from '../icons/iconMap';

const createNavItem = (label, to, icon, activeIcon = icon) => ({ label, to, icon, activeIcon });

export const desktopSidebarNavItems = [
  createNavItem('Home', '/app/feed', actionIcons.home, actionIcons.homeActive),
  createNavItem('Explore', '/app/explore', actionIcons.explore, actionIcons.exploreActive),
  createNavItem('Create', '/app/create-post', actionIcons.create),
  createNavItem('Messages', '/app/messages', actionIcons.messages, actionIcons.messagesActive),
];

export const mobileBottomNavItems = [
  createNavItem('Home', '/app/feed', actionIcons.home, actionIcons.homeActive),
  createNavItem('Explore', '/app/explore', actionIcons.explore, actionIcons.exploreActive),
  createNavItem('Create', '/app/create-post', actionIcons.create),
  createNavItem('Messages', '/app/messages', actionIcons.messages, actionIcons.messagesActive),
];

export const getProfileNavItem = (profilePath) => createNavItem('Profile', profilePath, actionIcons.profile, actionIcons.profileActive);
