import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ContactForm } from '../ContactForm';
import { Filter } from '../Filter';
import { ContactList } from '../ContactList';
import contactListDemo from '../../data/contactsList';
import { Container } from './App.styled';

export class App extends Component {
  state = {
    contacts: contactListDemo,
    filter: '',
  };

  sabmitForm = e => {
    const { contacts } = this.state;
    const { name } = e;

    const normalizedFilter = name.toLowerCase();
    const contactСheck = contacts.every(
      contact => contact.name.toLowerCase() !== normalizedFilter
    );

    contactСheck ? this.addContact(e) : this.alarmDuplicatioContact(name);
  };

  addContact = data => {
    const contact = { id: nanoid(), ...data };

    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));

    this.alarmAddContact(data.name);
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));

    this.alarmDeleteContact(id);
  };

  filterContacts = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContact = () => {
    const { filter, contacts } = this.state;

    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  alarmDuplicatioContact = name => {
    Notify.warning(`${name} is already in contacts.`);
  };

  alarmAddContact = name => {
    Notify.success(`Contact ${name} add.`);
  };

  alarmDeleteContact = id => {
    let object = this.state.contacts.find(elem => elem.id === id);

    Notify.info(`Contact ${object.name} delit.`);
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  render() {
    const { filter } = this.state;
    const { sabmitForm, filterContacts, getVisibleContact, deleteContact } =
      this;

    return (
      <Container>
        <div>
          <h1>Phonebook</h1>
          <ContactForm onSubmit={sabmitForm} />
          <h2>Contacts</h2>
          <Filter onChange={filterContacts} value={filter} />
          <ContactList
            contactList={getVisibleContact()}
            onDeleted={deleteContact}
          />
        </div>
      </Container>
    );
  }
}
