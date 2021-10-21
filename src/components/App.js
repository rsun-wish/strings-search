import './App.css';
import AppBar from './AppBar';
import SearchResult from './SearchResult';
import AboutDialog from './About';

function App() {
  return (
    <div className="App">
      <AppBar />
      <AboutDialog />
      <SearchResult />
    </div>
  );
}

export default App;
