import React, { useState } from 'react';
import { useBankStore } from '../hooks/useBankStoreHook';
import type { Contact } from '../mocks/api';
import { Search, User } from 'lucide-react';
import { contactButton, avatarDefault, avatarUser, listGrid } from '../styles/tailwindClasses';

interface Props {
    onSelect: (contact: Contact) => void;
}

export const StepRecipient: React.FC<Props> = ({ onSelect }) => {
    const [search, setSearch] = useState('');
    const { contacts, contactsLoading, contactsError } = useBankStore();
    const isLoading = contactsLoading;
    const isError = contactsError !== null;
    const error = contactsError;

    const filtered = contacts.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.account?.includes(search)
    );

    const favorites = contacts.filter(c => c.isFavorite);

    return (
        <div className="flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Seleccionar Destinatario</h2>
                <p className="text-sm text-gray-500 mt-1">Elige a quién deseas enviar dinero</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o cuenta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 min-h-[48px]"
                    aria-label="Buscar contacto"
                />
            </div>

            {isError ? (
                <div className="text-center py-8 text-red-600">
                    <p>{error instanceof Error ? error.message : 'Error al cargar contactos'}</p>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div></div>
            ) : contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No hay contactos disponibles</p>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6 max-h-[420px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                    {search === '' && favorites.length > 0 && (
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">⭐ Favoritos</h3>
                            <div className={listGrid}> 
                                    {favorites.map(contact => (
                                        <button
                                            key={contact.id}
                                            onClick={() => onSelect(contact)}
                                            className={contactButton}
                                            aria-label={`Seleccionar ${contact.name}`}
                                        >
                                            <div className={avatarDefault}>
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                                                <div className="text-xs sm:text-sm text-gray-500">Cta. {contact.account}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                            {search === '' ? '📋 Todos los contactos' : '🔍 Resultados'}
                        </h3>
                        <div className={listGrid}> 
                            {filtered.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => onSelect(contact)}
                                    className={contactButton}
                                    aria-label={`Seleccionar ${contact.name}`}
                                >
                                    <div className={avatarUser}> 
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                                        <div className="text-xs sm:text-sm text-gray-500">Cta. {contact.account}</div>
                                    </div>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    <p className="text-base font-medium">No se encontraron contactos</p>
                                    <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
