import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../mocks/api';
import type { Contact } from '../mocks/api';
import { Search, User } from 'lucide-react';

interface Props {
  onSelect: (contact: Contact) => void;
}

/**
 * Paso 1 del wizard — Selección de destinatario.
 * Lógica: Usa React Query para obtener contactos (QueryClient singleton del Shell).
 */
export const StepRecipient: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const { data: contacts = [], isPending, isError } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
    staleTime: 5 * 60_000,
  });

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.account?.includes(search)
  );
  const favorites = contacts.filter((c) => c.isFavorite);

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
        <p className="text-center py-8 text-red-600">Error al cargar contactos</p>
      ) : isPending ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {search === '' && favorites.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">⭐ Favoritos</h3>
              <div className="grid gap-2">
                {favorites.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                    aria-label={`Seleccionar ${contact.name}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                      <div className="text-xs text-gray-500">Cta. {contact.account}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              {search === '' ? '📋 Todos los contactos' : '🔍 Resultados'}
            </h3>
            <div className="grid gap-2">
              {filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => onSelect(contact)}
                  className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                  aria-label={`Seleccionar ${contact.name}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                    <div className="text-xs text-gray-500">Cta. {contact.account}</div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center py-8 text-gray-500">No se encontraron contactos</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
