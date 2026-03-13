import { useState } from 'react';
import './App.css';
import BookEvent from './pages/BookEvent';
import ShowEvents from './pages/ShowEvents';

function App() {
  const [activeTab, setActiveTab] = useState<'book' | 'show'>('book');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Calendar Appointment System</h1>
        <p>Book appointments with Dr. John</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          Book Appointment
        </button>
        <button
          className={`nav-tab ${activeTab === 'show' ? 'active' : ''}`}
          onClick={() => setActiveTab('show')}
        >
          View Appointments
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'book' ? <BookEvent /> : <ShowEvents />}
      </main>
    </div>
  );
}

export default App;
