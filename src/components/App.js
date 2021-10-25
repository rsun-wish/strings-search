import './App.css';
import AppBar from './AppBar';
import SearchResult from './SearchResult';
import AboutDialog from './About';
import MainBody from './MainBody';
import LeftMenuDrawer from './LeftManuDrawer'
import DataModalDisplay from './DataModalDisplay';

function App() {
  return (
    <div className="App">
      <AppBar />
      <LeftMenuDrawer />
      <DataModalDisplay />
      <MainBody />
      <AboutDialog />
      <SearchResult />
    </div>
  );
}

export default App;
