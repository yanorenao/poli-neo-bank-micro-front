// Centralized Tailwind class utilities for TransferWizard components
// Mobile-First Design with Enhanced UX

// Base button with touch-friendly targets and smooth interactions
export const btnBase = 'py-3 px-6 rounded-lg font-medium min-h-[48px] transition-all duration-200 ease-out active:scale-95 focus:outline-none';
export const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm`;
export const btnSecondary = `${btnBase} border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300`;

// Contact cards with enhanced hover states
export const contactButton = 'w-full flex items-center gap-3 sm:gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-left group transition-all duration-200 min-h-[72px] active:scale-[0.98]';

// Avatar styles with smooth transitions
export const avatarDefault = 'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg transition-all duration-200 group-hover:scale-110';
export const avatarUser = 'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200 group-hover:scale-110 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-700';

// Responsive grid for contact lists
export const listGrid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4';

// Amount input with enhanced visual hierarchy
export const amountInput = 'w-full text-4xl sm:text-5xl md:text-6xl text-center font-bold text-blue-900 bg-transparent border-b-4 py-4 sm:py-6 focus:outline-none focus:border-blue-600 transition-all duration-200 min-h-[60px]';

// Input and label base styles for forms
export const inputBase = 'w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow duration-200 min-h-[48px]';
export const labelBase = 'block text-sm font-medium text-gray-700 mb-2';
export const selectBase = `${inputBase} appearance-none bg-no-repeat bg-right pr-10`;

// Container with mobile-first responsive padding
export const wizardInnerPadding = 'p-4 sm:p-6 md:p-8';

// Wizard container: max-width optimized for forms, centered with safe padding
export const wizardContainer = 'w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 mt-4 sm:mt-8 mx-auto';
