import ContactsForm from './form/ContactsForm';
import { useEffect, useState } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { nanoid } from 'nanoid';
import Filter from './filters/Filter';
import ContactList from './contacts/ContactList';
import s from 'index.module.css';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const addUser = (name, phone) => {
    const isExist = contacts.filter(
      e =>
        e.name.toLowerCase() === name.toLowerCase() ||
        e.number.toLowerCase() === phone.toLowerCase()
    );
    if (isExist.length > 0) {
      Notify.failure(`${name} or ${phone} is already in contacts`);
      return;
    }

    const newContact = { id: nanoid(), name, number: phone };
    setContacts(prevContacts => [...prevContacts, newContact]);
  };

  const removeUser = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const filteredContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  useEffect(() => {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (parsedContacts && parsedContacts.length > 0)
      setContacts(parsedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className={s.app}>
      <h1>Phonebook</h1>
      <ContactsForm addUser={addUser} />

      <h2>Contacts</h2>
      <Filter filterFunc={setFilter} />
      <ContactList users={filteredContacts()} removeUser={removeUser} />
    </div>
  );
};
