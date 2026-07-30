import { useState, useEffect } from 'react';
import { contactsApi } from '../services/api';
import { useContactsStore } from '../stores/contactsStore';
import { Search, Pencil, Trash2, UserPlus, ArrowUpDown, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import GradientButton from '../components/ui/GradientButton';
import ActionButton from '../components/ui/ActionButton';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonLine } from '../components/ui/Skeleton';

const PAGE_SIZE = 8;

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Zustand State for filters and selected form context — unchanged
  const { searchQuery, setSearchQuery, selectedContact, setSelectedContact } = useContactsStore();

  // Form State — unchanged
  const [isEditing, setIsEditing] = useState(!!selectedContact);
  const [formData, setFormData] = useState(selectedContact || { name: '', phone: '' });
  const [formError, setFormError] = useState('');

  // Presentational-only local state: not persisted, not sent to any API
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await contactsApi.getContacts();
      setContacts(res.data.contacts || []);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortAsc]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact); // Persist selection
    setIsEditing(true);
    setFormData({ name: contact.name, phone: contact.phone });
  };

  const cancelEdit = () => {
    setSelectedContact(null); // Clear persistence
    setIsEditing(false);
    setFormData({ name: '', phone: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Name and phone are required.');
      return;
    }
    elif(!isNumber(formData.phone) && formData.phone.length < 10){
      setFormError('Phone Number Invalid');
      return;
    }

    try {
      if (isEditing) {
        await contactsApi.updateContact(selectedContact.name, { phone: formData.phone });
      } else {
        await contactsApi.createContact({ name: formData.name, phone: formData.phone });
      }
      cancelEdit(); // Reset form & store
      fetchContacts();
    } catch (error) {
      setFormError(error.response?.data?.detail || 'An error occurred.');
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await contactsApi.deleteContact(name);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact", error);
    }
  };

  // Compute filtered contacts based on persisted search — unchanged
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  // Presentational sort + pagination layered on top of the existing filter result
  const sortedContacts = [...filteredContacts].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  const totalPages = Math.max(1, Math.ceil(sortedContacts.length / PAGE_SIZE));
  const pageContacts = sortedContacts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Contact Table */}
      <div className="flex-[2] min-w-0">
        <SectionHeader
          action={
            <div className="flex items-center gap-2">
              <ActionButton
                icon={ArrowUpDown}
                size="sm"
                variant="ghost"
                onClick={() => setSortAsc((s) => !s)}
                title={sortAsc ? 'Sorted A → Z' : 'Sorted Z → A'}
              >
                {sortAsc ? 'A–Z' : 'Z–A'}
              </ActionButton>
              <div className="flex items-center gap-2 bg-surface border border-border rounded-ds-sm px-2.5 py-1.5 focus-within:border-accent transition-colors">
                <Search size={13} className="text-text-4" />
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  aria-label="Search contacts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-[12px] text-text-1 placeholder-text-4 focus:outline-none w-36"
                />
              </div>
            </div>
          }
        >
          Directory
        </SectionHeader>

        <Card padding="p-0" className="overflow-hidden">
          <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-surface-2 z-10">
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] text-text-3 font-bold uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-[11px] text-text-3 font-bold uppercase tracking-wider px-4 py-3">Phone</th>
                  <th className="text-right text-[11px] text-text-3 font-bold uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="px-4 py-3.5"><SkeletonLine width="w-32" /></td>
                      <td className="px-4 py-3.5"><SkeletonLine width="w-24" /></td>
                      <td className="px-4 py-3.5" />
                    </tr>
                  ))
                ) : pageContacts.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <EmptyState
                        icon={Users}
                        title={searchQuery ? 'No matches' : 'No contacts yet'}
                        description={searchQuery ? 'No contacts match your search.' : 'No contacts found in the database.'}
                      />
                    </td>
                  </tr>
                ) : (
                  pageContacts.map((contact, idx) => (
                    <tr key={idx} className="border-b border-border/60 last:border-b-0 hover:bg-surface-3/60 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-text-2 font-bold uppercase border border-border text-xs shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-text-1 text-[13.5px]">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-3 font-mono text-[12.5px]">{contact.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <ActionButton icon={Pencil} size="sm" onClick={() => handleEdit(contact)}>Edit</ActionButton>
                          <ActionButton icon={Trash2} size="sm" variant="danger" onClick={() => handleDelete(contact.name)}>Delete</ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && sortedContacts.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-[11.5px] text-text-4">
                {sortedContacts.length} contact{sortedContacts.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <ActionButton icon={ChevronLeft} size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
                <span className="text-[11.5px] text-text-3 tabular-nums">{page} / {totalPages}</span>
                <ActionButton icon={ChevronRight} size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column: Add/Edit Form */}
      <div className="flex-[1]">
        <SectionHeader>{isEditing ? 'Edit Contact' : 'New Contact'}</SectionHeader>

        <Card className="sticky top-24">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formError && (
              <div className="text-xs text-danger bg-danger-soft border border-danger/25 p-2.5 rounded-ds-sm">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-text-3 uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isEditing}
                placeholder="e.g., John Doe"
                className="w-full bg-surface border border-border rounded-ds-sm px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                required
              />
              {isEditing && <p className="text-[10px] text-text-4 mt-1">Name cannot be changed while editing.</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-3 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +1234567890"
                className="w-full bg-surface border border-border rounded-ds-sm px-3 py-2 text-sm text-text-1 focus:outline-none focus:border-accent transition-colors font-mono"
                required  
              />
            </div>

            <div className="flex gap-2 mt-2">
              <GradientButton type="submit" className="flex-1">
                <UserPlus size={15} />
                {isEditing ? 'Save Changes' : 'Add Contact'}
              </GradientButton>
              {isEditing && (
                <ActionButton type="button" variant="ghost" onClick={cancelEdit} className="flex-1 justify-center">
                  Cancel
                </ActionButton>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}